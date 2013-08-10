// backbone.datagrid v0.4.0-beta.1
//
// Copyright (c) 2012 Loïc Frering <loic.frering@gmail.com>
// Distributed under the MIT license
(function() {

var ComposedView = Backbone.View.extend({
  addNestedView: function(nestedView) {
    if (!this.nestedViews) this.nestedViews = [];
    this.nestedViews.push(nestedView);
  },

  removeNestedViews: function() {
    if (this.nestedViews) {
      _.invoke(this.nestedViews, 'remove');
      this.nestedViews = [];
    }
  },

  remove: function() {
    ComposedView.__super__.remove.call(this);
    this.removeNestedViews();
    return this;
  }
});

var Datagrid = ComposedView.extend({
  initialize: function(options) {
    this.options = options;
    this.columns = this.options.columns;
    _.defaults(this.options, {
      paginated:      false,
      page:           1,
      perPage:        10,
      tableClassName: 'table',
      emptyMessage:   '<p>No results found.</p>'
    });

    if (this.options.paginated && !this.options.footerControls) {
      this.options.footerControls = {
        middle: Pagination
      };
    }

    this.listenTo(this.collection, 'add remove', this.render);
    this._prepare();
  },

  render: function() {
    this.$el.empty();
    this.removeNestedViews();

    this.renderHeader();
    this.renderTable();
    this.renderFooter();
    /*if (this.options.paginated) {
      this.renderPagination();
    }*/

    return this;
  },

  renderHeader: function() {
    if (this.options.headerControls) {
      var options = _.extend({pager: this.pager}, this.options.headerControls);
      var headerControls = new Controls(options);
      this.$el.append(headerControls.render().el);
      this.addNestedView(headerControls);
    }
  },

  renderTable: function() {
    var table = new Table({
      collection:   this.collection,
      columns:      this.columns,
      pager:        this.pager,
      sorter:       this.sorter,
      emptyMessage: this.options.emptyMessage,
      className:    this.options.tableClassName,
      rowClassName: this.options.rowClassName,
      rowAttrs:     this.options.rowAttrs,
      attributes:   this.options.tableAttrs
    });

    this.$el.append(table.render().el);
    this.addNestedView(table);
  },

  renderFooter: function() {
    if (this.options.footerControls) {
      var options = _.extend({pager: this.pager}, this.options.footerControls);
      var footerControls = new Controls(options);
      this.$el.append(footerControls.render().el);
      this.addNestedView(footerControls);
    }
  },

  renderPagination: function() {
    var pagination = new Pagination({pager: this.pager});
    this.$el.append(pagination.render().el);
    this.addNestedView(pagination);
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

  remove: function() {
    Datagrid.__super__.remove.call(this);
    this.pager.off();
    return this;
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
    var data    = options.data || {};

    options.data = _.extend(data, this._getRequestData());
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
    options.reset  = true;

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
    this.listenTo(this.sorter, 'change', function() {
      this._sort(this.sorter.get('column'), this.sorter.get('order'));
    });
  },

  _preparePager: function() {
    this.pager = new Pager({
      currentPage: this.options.page,
      perPage:     this.options.perPage
    });

    this.listenTo(this.pager, 'change:currentPage', function () {
      this._page();
    });
    this.listenTo(this.pager, 'change:perPage', function() {
      this.page(1);
    });
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

var Table = Datagrid.Table = ComposedView.extend({
  tagName: 'table',

  initialize: function(options) {
    this.options    = options;
    this.collection = this.options.collection;
    this.columns    = this.options.columns;
    this.pager      = this.options.pager;
    this.sorter     = this.options.sorter;

    this.listenTo(this.collection, 'reset sort', this.render);
  },

  render: function() {
    this.$el.empty();
    this.removeNestedViews();

    var header = new Header({columns: this.columns, sorter: this.sorter});
    this.$el.append(header.render().el);
    this.addNestedView(header);

    this.$el.append('<tbody></tbody>');

    if (this.collection.isEmpty()) {
      this.$el.append(this.options.emptyMessage);
    } else {
      this.collection.forEach(this.renderRow, this);
    }

    return this;
  },

  renderRow: function(model) {
    var options = {
      model:      model,
      columns:    this.columns,
      attributes: _.isFunction(this.options.rowAttrs) ? this.options.rowAttrs(model) : this.options.rowAttrs
    };
    var rowClassName = this.options.rowClassName;
    if (_.isFunction(rowClassName)) {
      rowClassName = rowClassName(model);
    }
    options.className = rowClassName;

    var row = new Row(options);
    this.$('tbody').append(row.render(this.columns).el);
    this.addNestedView(row);
  }
});

var Header = Datagrid.Header = ComposedView.extend({
  tagName: 'thead',

  initialize: function(options) {
    this.options = options;
    this.columns = this.options.columns;
    this.sorter  = this.options.sorter;
  },

  render: function() {
    this.removeNestedViews();

    var model = new Backbone.Model();
    var headerColumn, columns = [];
    _.each(this.columns, function(column, i) {
      headerColumn          = _.clone(column);
      headerColumn.property = column.property || column.index;
      headerColumn.view     = column.headerView || {
          type: HeaderCell,
          sorter: this.sorter
        };

      model.set(headerColumn.property, column.title);
      columns.push(headerColumn);
    }, this);

    var row = new Row({model: model, columns: columns, header: true});
    this.$el.html(row.render().el);
    this.addNestedView(row);

    return this;
  }
});

var Row = Datagrid.Row = Backbone.View.extend({
  tagName: 'tr',

  initialize: function(options) {
    this.options = options;
    this.columns = this.options.columns;
    this.listenTo(this.model, 'change', this.render);
  },

  render: function() {
    this.$el.empty();
    _.each(this.columns, this.renderCell, this);
    return this;
  },

  renderCell: function(column) {
    var cellView = this._resolveCellView(column);
    this.$el.append(cellView.render().el);
  },

  _resolveCellView: function(column) {
    var options = {
      model:      this.model,
      column:     column,
      attributes: _.isFunction(column.cellAttrs) ? column.cellAttrs(this.model) : column.cellAttrs
    };
    if (this.options.header || column.header) {
      options.tagName = 'th';
    }
    var cellClassName = column.cellClassName;
    if (_.isFunction(cellClassName)) {
      cellClassName = cellClassName(this.model);
    }
    options.className = cellClassName;


    var view = column.view || Cell;

    // Resolve view from string or function
    if (typeof view !== 'object' && !(view.prototype && view.prototype.render)) {
      if (_.isString(view)) {
        options.callback = _.template(view);
        view = TemplateCell;
      } else if (_.isFunction(view) && !view.prototype.render) {
        options.callback = view;
        view = CallbackCell;
      } else {
        throw new TypeError('Invalid view passed to column "' + column.title + '".');
      }
    }

    // Resolve view from options
    else if (typeof view === 'object') {
      _.extend(options, view);
      view = view.type;
      if (!view || !view.prototype || !view.prototype.render) {
        throw new TypeError('Invalid view passed to column "' + column.title + '".');
      }
    }

    return new view(options);
  }
});

var Controls = Datagrid.Controls = ComposedView.extend({
  initialize: function(options) {
    this.options = options;
    this.pager   = this.options.pager;

    this.left   = this._resolveView(this.options.left);
    this.middle = this._resolveView(this.options.middle);
    this.right  = this._resolveView(this.options.right);
  },

  render: function() {
    this.$el.empty();
    this.removeNestedViews();

    _.chain(['left', 'middle', 'right'])
      .filter(function(position) {
        return this[position];
      }, this)
      .each(function(position) {
        var control = this[position];
        $('<div></div>', {'class': 'control ' + position})
          .append(control.render().el)
          .appendTo(this.$el);
        this.addNestedView(control);
      }, this);

    return this;
  },

  _resolveView: function(options) {
    if (!options) {
      return null;
    }

    var view;

    if (options.prototype && options.prototype.render) {
      view = options;
      options = {};
    }
    // Resolve view from options
    else if (typeof options === 'object') {
      view = options.control;
      if (!view || !view.prototype || !view.prototype.render) {
        throw new TypeError('Invalid view passed to controls.');
      }
    }
    else {
      throw new TypeError('Invalid view passed to controls.');
    }

    _.extend(options, {pager: this.pager});

    return new view(options);
  }
});

var Control = Datagrid.Control = Backbone.View.extend({
  initialize: function(options) {
    this.options = options;
    this.pager   = this.options.pager;
  }
});

var Pagination = Datagrid.Pagination = Control.extend({
  className: 'pagination pagination-centered',

  events: {
    'click li:not(.disabled) a': 'page',
    'click li.disabled a': function(e) { e.preventDefault(); }
  },

  initialize: function() {
    Pagination.__super__.initialize.apply(this, arguments);
    _.defaults(this.options, {
      full: true
    });

    this.listenTo(this.pager, 'change', this.render);
  },

  render: function() {
    var $ul = $('<ul></ul>'), $li;

    $li = $('<li class="prev"><a href="#">«</a></li>');
    if (!this.pager.hasPrev()) {
      $li.addClass('disabled');
    }
    $ul.append($li);

    if (this.options.full && this.pager.hasTotal()) {
      for (var i = 1; i <= this.pager.get('totalPages'); i++) {
        $li = $('<li></li>');
        if (i === this.pager.get('currentPage')) {
          $li.addClass('active');
        }
        $li.append('<a href="#">' + i + '</a>');
        $ul.append($li);
      }
    }

    $li = $('<li class="next"><a href="#">»</a></li>');
    if (!this.pager.hasNext()) {
      $li.addClass('disabled');
    }
    $ul.append($li);

    this.$el.html($ul);
    return this;
  },

  page: function(event) {
    var $target = $(event.target), page;
    if ($target.parent().hasClass('prev')) {
      this.pager.prev();
    } else if ($target.parent().hasClass('next')) {
      this.pager.next();
    }
    else {
      this.pager.page(parseInt($(event.target).html(), 10));
    }
    return false;
  }
});

var ItemsPerPage = Datagrid.ItemsPerPage = Control.extend({
  events: {
    change: 'perPage'
  },

  initialize: function() {
    ItemsPerPage.__super__.initialize.apply(this, arguments);

    _.defaults(this.options, {
      increment: this.pager.get('perPage'),
      max:       4 * this.pager.get('perPage')
    });
  },

  render: function() {
    var $select   = $('<select></select>'), i,
        increment = this.options.increment,
        max       = this.options.max;

    for (i = increment; i <= max; i += increment) {
      $option = $('<option></option>');
      $option.html(i);
      $select.append($option);
    }

    this.$el.html($select);
    return this;
  },

  perPage: function(event) {
    var perPage = $(event.target).val();
    this.pager.set('perPage', perPage);
  }
});

var Cell = Datagrid.Cell = Backbone.View.extend({
  tagName: 'td',

  initialize: function(options) {
    this.options = options;
    this.column  = this.options.column;
  },

  render: function() {
    this._prepareValue();
    this.$el.html(this.value);
    return this;
  },

  _prepareValue: function() {
    this.value = this.model.get(this.column.property);
  }
});

var CallbackCell = Datagrid.CallbackCell = Cell.extend({
  initialize: function() {
    CallbackCell.__super__.initialize.apply(this, arguments);
    this.callback = this.options.callback;
  },

  _prepareValue: function() {
    this.value = this.callback(this.model);
  }
});

var ActionCell = Datagrid.ActionCell = Cell.extend({
  initialize: function() {
    ActionCell.__super__.initialize.apply(this, arguments);
  },

  action: function() {
    return this.options.action(this.model);
  },

  _prepareValue: function() {
    var a = $('<a></a>');

    a.html(this.options.label);
    a.attr('href', this.options.href || '#');
    if (this.options.actionClassName) {
      var actionClassName = this.options.actionClassName;
      // Check if the classname is actually a callback and run it if it is.
      if (_.isFunction(actionClassName)) {
	actionClassName = actionClassName(this.model);
      }
      a.addClass(actionClassName);
    }
    if (this.options.action) {
      this.delegateEvents({
        'click a': this.action
      });
    }

    this.value = a;
  }
});

var HeaderCell = Datagrid.HeaderCell = Cell.extend({
  initialize: function() {
    HeaderCell.__super__.initialize.apply(this, arguments);

    this.sorter = this.options.sorter;

    if (this.column.sortable) {
      this.delegateEvents({click: 'sort'});
    }
  },

  render: function() {
    this._prepareValue();
    var html = this.value, icon;

    if (this.column.sortable) {
      this.$el.addClass('sortable');
      if (this.sorter.sortedBy(this.column.sortedProperty || this.column.property) || this.sorter.sortedBy(this.column.index)) {
        if (this.sorter.sortedASC()) {
          icon = 'icon-chevron-up';
        } else {
          icon = 'icon-chevron-down';
        }
      } else {
        icon = 'icon-minus';
      }

      html += ' <i class="' + icon + ' pull-right"></i>';
    }

    this.$el.html(html);
    return this;
  },

  sort: function() {
    this.sorter.sort(this.column.sortedProperty || this.column.property);
  }
});

var TemplateCell = Datagrid.TemplateCell = CallbackCell.extend({

  _prepareValue: function() {
    this.value = this.callback(this.model.toJSON());
  }
});

var Pager = Datagrid.Pager = Backbone.Model.extend({
  initialize: function() {
    this.on('change:perPage change:total', function() {
      this.totalPages(this.get('total'));
    }, this);
    if (this.has('total')) {
      this.totalPages(this.get('total'));
    }
  },

  update: function(options) {
    _.each(['hasNext', 'hasPrev', 'total', 'totalPages', 'lastPage'], function(p) {
      if (!_.isUndefined(options[p])) {
        this.set(p, options[p]);
      }
    }, this);
  },

  totalPages: function(total) {
    if (_.isNumber(total)) {
      this.set('totalPages', Math.ceil(total/this.get('perPage')));
    } else {
      this.set('totalPages', undefined);
    }
  },

  page: function(page) {
    if (this.inBounds(page)) {
      if (page === this.get('currentPage')) {
        this.trigger('change:currentPage');
      } else {
        this.set('currentPage', page);
      }
    }
  },

  next: function() {
    this.page(this.get('currentPage') + 1);
  },

  prev: function() {
    this.page(this.get('currentPage') - 1);
  },

  hasTotal: function() {
    return this.has('totalPages');
  },

  hasNext: function() {
    if (this.hasTotal()) {
      return this.get('currentPage') < this.get('totalPages');
    } else {
      return this.get('hasNext');
    }
  },

  hasPrev: function() {
    if (this.has('hasPrev')) {
      return this.get('hasPrev');
    } else {
      return this.get('currentPage') > 1;
    }
  },

  inBounds: function(page) {
    return !this.hasTotal() || page > 0 && page <= this.get('totalPages');
  },

  set: function() {
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    args[2] = _.extend({}, args[2], {validate: true});
    Backbone.Model.prototype.set.apply(this, args);
  },

  validate: function(attrs) {
    if (attrs.perPage < 1) {
      throw new Error('perPage must be greater than zero.');
    }
  }
});

var Sorter = Datagrid.Sorter = Backbone.Model.extend({
  sort: function(column, order) {
    if (!order && this.get('column') === column) {
      this.toggleOrder();
    } else {
      this.set({
        column: column,
        order: order || Sorter.ASC
      });
    }
  },

  sortedBy: function(column) {
    return this.get('column') === column;
  },

  sortedASC: function() {
    return this.get('order') === Sorter.ASC;
  },

  sortedDESC: function() {
    return this.get('order') === Sorter.DESC;
  },

  toggleOrder: function() {
    if (this.get('order') === Sorter.ASC) {
      this.set('order', Sorter.DESC);
    } else {
      this.set('order', Sorter.ASC);
    }
  }
});

Sorter.ASC  = 'asc';
Sorter.DESC = 'desc';

  Backbone.Datagrid = Datagrid;
})();
