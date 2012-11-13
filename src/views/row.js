var Row = Datagrid.Row = Backbone.View.extend({
  tagName: 'tr',

  initialize: function() {
    this.columns = this.options.columns;
    this.model.on('change', this.render, this);
  },

  render: function() {
    this.$el.empty();
    _.each(this.columns, this.renderCell, this);
    return this;
  },

  renderCell: function(column) {
    var cellView = this._resolveCellView(column);
    this.$el.append(cellView.render().el);
  },

  _resolveCellView: function(column) {
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


    var view = column.view || Cell;

    // Resolve view from string or function
    if (typeof view !== 'object' && !(view.prototype && view.prototype.render)) {
      if (_.isString(view)) {
        options.callback = _.template(view);
        view = CallbackCell;
      } else if (_.isFunction(view) && !view.prototype.render) {
        options.callback = view;
        view = CallbackCell;
      } else {
        throw new TypeError('Invalid view passed to column "' + column.title + '".');
      }
    }

    // Resolve view from options
    else if (typeof view === 'object') {
      _.extend(options, view);
      view = view.type;
      if (!view || !view.prototype || !view.prototype.render) {
        throw new TypeError('Invalid view passed to column "' + column.title + '".');
      }
    }

    return new view(options);
  }
});
