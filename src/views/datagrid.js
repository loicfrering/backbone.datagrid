define(['backbone', 'handlebars', 'views/rows', 'text!../../../src/templates/datagrid.hbs'], function(Backbone, Handlebars, Row, datagridTemplate) {

  var Datagrid = Backbone.View.extend({
    initialize: function() {
      this._prepareColumns();
    },

    render: function() {
      var template = Handlebars.compile(datagridTemplate);
      var html     = template({
        columns: this.columns
      });
      this.$el.html(html);

      this.collection.forEach(function(model) {
        this.addRow(model);
      }, this);

      return this;
    },

    addRow: function(model) {
      var row = new Row({model: model, columns: this.columns});
      this.$('tbody').append(row.render(this.columns).el);
    },

    _prepareColumns: function() {
      this.columns = [];
      var model = this.collection.first();
      for (var p in model.toJSON()) {
        this.columns.push({
          name:     p.charAt(0).toUpperCase() + p.substr(1),
          property: p
        });
      }
    }
  });

  return Datagrid;

});
