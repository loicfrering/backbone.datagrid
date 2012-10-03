define(['backbone', 'views/row'], function(Backbone, Row) {

  var Header = Backbone.View.extend({
    tagName: 'thead',

    initialize: function() {
      this.columns = this.options.columns;
    },

    render: function() {
      var model = new Backbone.Model();
      _.each(this.columns, function(column) {
        column.header = true;
        model.set(column.property, column.title);
      }, this);

      row = new Row({model: model, columns: this.columns, header: true});
      this.$el.html(row.render().el);

      return this;
    }
  });

  return Header;

});
