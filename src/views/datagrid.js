define(['backbone', 'views/header', 'views/row', 'views/pagination'], function(Backbone, Header, Row, Pagination) {

  var Datagrid = Backbone.View.extend({
    initialize: function() {
      this.columns = this.options.columns;
      this.options = _.defaults(this.options, {
        paginated: false,
        page:      1,
        perPage:   10
      });

      if (this.options.paginated && this.options.perPage < 1) {
        throw new Error('perPage must be greater than zero.');
      }

      this.collection.on('reset', this.render, this);

      this._prepareColumns();
      if (this.options.paginated) {
        this.page(this.options.page, {silent: true});
      }
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
      var $table = $('<table></table>', {'class': 'table'});
      this.$el.append($table);

      var header = new Header({columns: this.columns});
      $table.append(header.render().el);

      $table.append('<tbody></tbody>');

      this.collection.forEach(this.renderRow, this);
    },

    renderPagination: function() {
      var pagination = new Pagination({current: this.options.page, total: this.totalPages});
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

    sort: function(column) {
      this.collection.comparator = function(model) {
        return model.get(column);
      };
      this.collection.sort();
    },

    page: function(page, options) {
      if (this.options.inMemory) {
        this._pageInMemory(page, options);
      } else {
        this._page(page, options);
      }
    },

    _page: function(page, options) {
      this.collection.fetch(options);
    },

    _pageInMemory: function(page, options) {
      if (!this._originalCollection) {
        this._originalCollection = this.collection.clone();
      }

      var perPage = this.options.perPage;

      var begin = (page - 1) * perPage;
      var end   = begin + perPage;

      this.collection.reset(this._originalCollection.slice(begin, end), options);
      this.totalPages = Math.ceil(this._originalCollection.size()/this.options.perPage, 10);
    },

    _prepareColumns: function() {
      if (!this.columns || _.isEmpty(this.columns)) {
        this._defaultColumns();
      } else {
        _.each(this.columns, function(column, i) {
          this.columns[i] = this._prepareColumn(column);
        }, this);
      }
    },

    _prepareColumn: function(column) {
      if (_.isString(column)) {
        column = { property: column };
      }
      if (_.isObject(column)) {
        column.title = column.title || column.property.charAt(0).toUpperCase() + column.property.substr(1);
      }
      return column;
    },

    _defaultColumns: function() {
      this.columns = [];
      var model = this.collection.first();
      if (model) {
        for (var p in model.toJSON()) {
          this.columns.push(this._prepareColumn(p));
        }
      }
    }
  });

  return Datagrid;

});
