define(['backbone', 'views/header', 'views/row'], function(Backbone, Header, Row) {

  var Datagrid = Backbone.View.extend({
    tagName: 'table',

    initialize: function() {
      this.columns = this.options.columns;
      this.collection.on('reset', this.render, this);
      this._prepareColumns();
    },

    render: function() {
      var header = new Header({columns: this.columns});
      this.$el.html(header.render().el);

      this.$el.append('<tbody></tbody>');

      this.collection.forEach(this.renderRow, this);

      return this;
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
