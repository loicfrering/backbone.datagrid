var Controls = Datagrid.Controls = Backbone.View.extend({
  initialize: function() {
    this.pager = this.options.pager;

    this.left   = this._resolveView(this.options.left);
    this.middle = this._resolveView(this.options.middle);
    this.right  = this._resolveView(this.options.right);
  },

  render: function() {
    this.$el.empty();

    _.chain(['left', 'middle', 'right'])
      .filter(function(position) {
        return this[position];
      }, this)
      .each(function(position) {
        this.$el.append(this[position].render().el);
      }, this);

    return this;
  },

  remove: function() {
    Datagrid.__super__.remove.call(this);

    _.each(this.subviews, function(subview) {
      subview.remove();
    });

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
