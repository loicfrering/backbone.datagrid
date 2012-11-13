var Pager = Datagrid.Pager = Backbone.Model.extend({
  initialize: function() {
    this.on('change:perPage change:total', function() {
      this.totalPages(this.get('total'));
    }, this);
    this.totalPages(this.get('total'));
  },

  totalPages: function(total) {
    this.set('totalPages', Math.ceil(total/this.get('perPage')));
  },

  page: function(page) {
    if (this.inBounds(page)) {
      this.set('currentPage', page);
    }
  },

  next: function() {
    this.page(this.get('currentPage') + 1);
  },

  prev: function() {
    this.page(this.get('currentPage') - 1);
  },

  inBounds: function(page) {
    return page > 0 && page <= this.get('totalPages');
  },

  validate: function(attrs) {
    if (attrs.perPage < 1) {
      throw new Error('perPage must be greater than zero.');
    }
  }
});
