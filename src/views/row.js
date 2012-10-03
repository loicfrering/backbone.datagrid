define(['backbone', 'views/cell'], function(Backbone, Cell) {

  var Row = Backbone.View.extend({
    tagName: 'tr',

    initialize: function() {
      this.columns = this.options.columns;
      this.model.on('change', this.render, this);
    },

    render: function() {
      this.$el.empty();
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
