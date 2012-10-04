define(['backbone', 'views/cell', 'views/callback-cell'], function(Backbone, Cell, CallbackCell) {

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
      if (this.options.header || column.header) {
        options.tagName = 'th';
      }
      var cellClassName = column.cellClassName;
      if (_.isFunction(cellClassName)) {
        cellClassName = cellClassName(this.model);
      }
      options.className = cellClassName;

      var cellView = this._resolveCellView(column.view, options);
      var cell = new cellView(options);
      this.$el.append(cell.render().el);
    },

    _resolveCellView: function(view, options) {
      if (typeof view === 'function') {
        options.callback = view;
        return CallbackCell;
      }
      return view || Cell;
    }
  });

  return Row;

});
