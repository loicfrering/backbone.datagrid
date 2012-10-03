define(['backbone', 'handlebars', 'text!../../../../src/templates/row.hbs'], function(Backbone, Handlebars, rowTemplate) {

  var Row = Backbone.View.extend({
    tagName: 'tr',

    initialize: function() {
      this.columns = this.options.columns;
    },

    render: function() {
      var values   = this._prepareValues();
      var template = Handlebars.compile(rowTemplate);
      var html     = template({
        values: values
      });
      this.$el.html(html);

      return this;
    },

    _prepareValues: function() {
      var values = [];
      this.columns.forEach(function(column) {
        values.push(this.model.get(column.property));
      }.bind(this));
      return values;
    }
  });

  return Row;

});
