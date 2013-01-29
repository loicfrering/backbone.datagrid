var Pager = Datagrid.Pager = Backbone.Model.extend({
  initialize: function() {
    this.on('change:perPage change:total', function() {
      this.totalPages(this.get('total'));
    }, this);
    if (this.has('total')) {
      this.totalPages(this.get('total'));
    }
  },

  update: function(options) {
    _.each(['hasNext', 'hasPrev', 'total', 'totalPages', 'lastPage'], function(p) {
      if (!_.isUndefined(options[p])) {
        this.set(p, options[p]);
      }
    }, this);
  },

  totalPages: function(total) {
    if (_.isNumber(total)) {
      this.set('totalPages', Math.ceil(total/this.get('perPage')));
    } else {
      this.set('totalPages', undefined);
    }
  },

  page: function(page) {
    if (this.inBounds(page)) {
      if (page === this.get('currentPage')) {
        this.trigger('change:currentPage');
      } else {
        this.set('currentPage', page);
      }
    }
  },

  next: function() {
    this.page(this.get('currentPage') + 1);
  },

  prev: function() {
    this.page(this.get('currentPage') - 1);
  },

  hasTotal: function() {
    return this.has('totalPages');
  },

  hasNext: function() {
    if (this.hasTotal()) {
      return this.get('currentPage') < this.get('totalPages');
    } else {
      return this.get('hasNext');
    }
  },

  hasPrev: function() {
    if (this.has('hasPrev')) {
      return this.get('hasPrev');
    } else {
      return this.get('currentPage') > 1;
    }
  },

  inBounds: function(page) {
    return !this.hasTotal() || page > 0 && page <= this.get('totalPages');
  },

  set: function() {
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    args[2] = _.extend({}, args[2], {validate: true});
    Backbone.Model.prototype.set.apply(this, args);
  },

  validate: function(attrs) {
    if (attrs.perPage < 1) {
      throw new Error('perPage must be greater than zero.');
    }
  }
});
