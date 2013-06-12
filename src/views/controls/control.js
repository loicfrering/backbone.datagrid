var Control = Datagrid.Control = Backbone.View.extend({
  initialize: function(options) {
    this.options = options;
    this.pager   = this.options.pager;
  }
});
