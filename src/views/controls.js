var Controls = Datagrid.Controls = ComposedView.extend({
  initialize: function(options) {
    this.options = options;
    this.pager   = this.options.pager;

    this.left   = this._resolveView(this.options.left);
    this.middle = this._resolveView(this.options.middle);
    this.right  = this._resolveView(this.options.right);
  },

  render: function() {
    this.$el.empty();
    this.removeNestedViews();

    _.chain(['left', 'middle', 'right'])
      .filter(function(position) {
        return this[position];
      }, this)
      .each(function(position) {
        var control = this[position];
        $('<div></div>', {'class': 'control ' + position})
          .append(control.render().el)
          .appendTo(this.$el);
        this.addNestedView(control);
      }, this);

    return this;
  },

  _resolveView: function(options) {
    if (!options) {
      return null;
    }

    var view;

    if (options.prototype && options.prototype.render) {
      view = options;
      options = {};
    }
    // Resolve view from options
    else if (typeof options === 'object') {
      view = options.control;
      if (!view || !view.prototype || !view.prototype.render) {
        throw new TypeError('Invalid view passed to controls.');
      }
    }
    else {
      throw new TypeError('Invalid view passed to controls.');
    }

    _.extend(options, {pager: this.pager});

    return new view(options);
  }
});
