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
      this.$el.append(header.render().el);

      this.$el.append('<tbody></tbody>');

      this.collection.forEach(this.renderRow, this);

      return this;
    },

    renderRow: function(model) {
      var row = new Row({model: model, columns: this.columns});
      this.$('tbody').append(row.render(this.columns).el);
    },

    sort: function(column) {
      this.collection.comparator = function(model) {
        return model.get(column.property);
      };
      this.collection.sort();
    },

    _prepareColumns: function() {
      if (!this.columns || _.isEmpty(this.columns)) {
        this.columns = [];
        var model = this.collection.first();
        for (var p in model.toJSON()) {
          this.columns.push({
            name:     p.charAt(0).toUpperCase() + p.substr(1),
            property: p
          });
        }
      }
    }
  });

  return Datagrid;

});
