var ComposedView = Backbone.View.extend({
  addNestedView: function(nestedView) {
    if (!this.nestedViews) this.nestedViews = [];
    this.nestedViews.push(nestedView);
  },

  removeNestedViews: function() {
    if (this.nestedViews) {
      _.invoke(this.nestedViews, 'remove');
      this.nestedViews = [];
    }
  },

  remove: function() {
    ComposedView.__super__.remove.call(this);
    this.removeNestedViews();
    return this;
  }
});
