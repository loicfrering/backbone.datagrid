var Datagrid = Backbone.View.extend({
  initialize: function() {
    this.columns = this.options.columns;
    this.options = _.defaults(this.options, {
      paginated:      false,
      page:           1,
      perPage:        10,
      tableClassName: 'table',
      emptyMessage:   '<p>No results found.</p>'
    });

    this.listenTo(this.collection, 'add remove reset', this.render);
    this._prepare();
  },

  render: function() {
    this.$el.empty();
    this.renderTable();
    if (this.options.paginated) {
      this.renderPagination();
    }

    return this;
  },

  renderTable: function() {
    var $table = $('<table></table>', {'class': this.options.tableClassName});
    this.$el.append($table);

    var header = new Header({columns: this.columns, sorter: this.sorter});
    $table.append(header.render().el);

    $table.append('<tbody></tbody>');

    if (this.collection.isEmpty()) {
      this.$el.append(this.options.emptyMessage);
    } else {
      this.collection.forEach(this.renderRow, this);
    }
  },

  renderPagination: function() {
    var pagination = new Pagination({pager: this.pager});
    this.$el.append(pagination.render().el);
  },

  renderRow: function(model) {
    var options = {
      model: model,
      columns: this.columns
    };
    var rowClassName = this.options.rowClassName;
    if (_.isFunction(rowClassName)) {
      rowClassName = rowClassName(model);
    }
    options.className = rowClassName;

    var row = new Row(options);
    this.$('tbody').append(row.render(this.columns).el);
  },

  refresh: function(options) {
    if (this.options.paginated) {
      this._page(options);
    } else {
      if (this.options.inMemory) {
        this.collection.trigger('reset', this.collection);
        if (options && options.success) {
          options.success();
        }
      } else {
        this._request(options);
      }
    }
  },

  sort: function(column, order) {
    this.sorter.sort(column, order);
  },

  page: function(page) {
    this.pager.page(page);
  },

  perPage: function(perPage) {
    this.pager.set('perPage', perPage);
  },

  _sort: function() {
    if (this.options.inMemory) {
      this._sortInMemory();
    } else {
      this._sortRequest();
    }
  },

  _sortInMemory: function() {
    if (this.options.paginated) {
      this._originalCollection.comparator = _.bind(this._comparator, this);
      this._originalCollection.sort();
      this.page(1);
    } else {
      this.collection.comparator = _.bind(this._comparator, this);
      this.collection.sort();
    }
  },

  _comparator: function(model1, model2) {
    var columnComparator = this._comparatorForColumn(this.sorter.get('column'));
    var order = columnComparator(model1, model2);
    return this.sorter.sortedASC() ? order : -order;
  },

  _comparatorForColumn: function(column) {
    var c = _.find(this.columns, function(c) {
      return c.property === column || c.index === column;
    });
    return c ? c.comparator : undefined;
  },

  _sortRequest: function() {
    this._request();
  },

  _page: function(options) {
    if (this.options.inMemory) {
      this._pageInMemory(options);
    } else {
      this._pageRequest(options);
    }
  },

  _pageRequest: function(options) {
    this._request(options);
  },

  _request: function(options) {
    options     = options || {};
    var success = options.success;
    var silent  = options.silent;

    options.data = this._getRequestData();
    options.success = _.bind(function(collection) {
      if (!this.columns || _.isEmpty(this.columns)) {
        this._prepareColumns();
      }
      if (success) {
        success();
      }
      if (this.options.paginated) {
        this.pager.update(collection);
      }
      if (!silent) {
        collection.trigger('reset', collection);
      }
    }, this);
    options.silent = true;

    this.collection.fetch(options);
  },

  _getRequestData: function() {
    if (this.collection.data && _.isFunction(this.collection.data)) {
      return this.collection.data(this.pager, this.sorter);
    } else if (this.collection.data && typeof this.collection.data === 'object') {
      var data = {};
      _.each(this.collection.data, function(value, param) {
        if (_.isFunction(value)) {
          value = value(this.pager, this.sorter);
        }
        data[param] = value;
      }, this);
      return data;
    } else if (this.options.paginated) {
      return {
        page:     this.pager.get('currentPage'),
        per_page: this.pager.get('perPage')
      };
    }

    return {};
  },

  _pageInMemory: function(options) {
    if (!this._originalCollection) {
      this._originalCollection = this.collection.clone();
    }

    var page    = this.pager.get('currentPage');
    var perPage = this.pager.get('perPage');

    var begin = (page - 1) * perPage;
    var end   = begin + perPage;

    if (options && options.success) {
      options.success();
    }
    this.pager.set('total', this._originalCollection.size());

    this.collection.reset(this._originalCollection.slice(begin, end), options);
  },

  _prepare: function() {
    this._prepareSorter();
    this._preparePager();
    this._prepareColumns();
    this.refresh();
  },

  _prepareSorter: function() {
    this.sorter = new Sorter();
    this.sorter.on('change', function() {
      this._sort(this.sorter.get('column'), this.sorter.get('order'));
    }, this);
  },

  _preparePager: function() {
    this.pager = new Pager({
      currentPage: this.options.page,
      perPage:     this.options.perPage
    });

    this.pager.on('change:currentPage', function () {
      this._page();
    }, this);
    this.pager.on('change:perPage', function() {
      this.page(1);
    }, this);
  },

  _prepareColumns: function() {
    if (!this.columns || _.isEmpty(this.columns)) {
      this._defaultColumns();
    } else {
      _.each(this.columns, function(column, i) {
        this.columns[i] = this._prepareColumn(column, i);
      }, this);
    }
  },

  _prepareColumn: function(column, index) {
    if (_.isString(column)) {
      column = { property: column };
    }
    if (_.isObject(column)) {
      column.index = index;
      if (column.property) {
        column.title = column.title || this._formatTitle(column.property);
      } else if (!column.property && !column.view) {
        throw new Error('Column \'' + column.title + '\' has no property and must accordingly define a custom cell view.');
      }
      if (this.options.inMemory && column.sortable) {
        if (!column.comparator && !column.property && !column.sortedProperty) {
          throw new Error('Invalid column definition: a sortable column must have a comparator, property or sortedProperty defined.');
        }
        column.comparator = column.comparator || this._defaultComparator(column.sortedProperty || column.property);
      }
    }
    return column;
  },

  _formatTitle: function(title) {
    return _.map(title.split(/\s|_/), function(word) {
      return word.charAt(0).toUpperCase() + word.substr(1);
    }).join(' ');
  },

  _defaultColumns: function() {
    this.columns = [];
    var model = this.collection.first(), i = 0;
    if (model) {
      for (var p in model.toJSON()) {
        this.columns.push(this._prepareColumn(p, i++));
      }
    }
  },

  _defaultComparator: function(column) {
    return function(model1, model2) {
      var val1 = model1.has(column) ? model1.get(column) : '';
      var val2 = model2.has(column) ? model2.get(column) : '';
      return val1.localeCompare(val2);
    };
  }
});
