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
      var options = {
        model:  this.model,
        column: column
      };
      if (this.options.header) {
        options.tagName = 'th';
      }
      var cell = new Cell(options);
      this.$el.append(cell.render().el);
    }
  });

  return Row;

});
