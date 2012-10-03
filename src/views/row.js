define(['backbone', 'views/cell'], function(Backbone, Cell) {

  var Row = Backbone.View.extend({
    tagName: 'tr',

    initialize: function() {
      this.columns = this.options.columns;
    },

    render: function() {
      _.forEach(this.columns, this.renderCell, this);
      return this;
    },

    renderCell: function(column) {
      var cell = new Cell({
        model: this.model,
        column: column
      });
      this.$el.append(cell.render().el);
    }
  });

  return Row;

});
