(function(Backbone) {

  var Repositories = Backbone.Collection.extend({
    initialize: function(models, user) {
      this.user = user;
    },

    url: function() {
      return 'https://api.github.com/users/' + this.user + '/repos?callback=?';
    },

    data: function(pager) {
      return {
        per_page: pager.get('perPage'),
        page:     pager.get('currentPage')
      };
    },

    parse: function(resp) {
      this.hasNext = false;
      var link = _.find(resp.meta.Link, function(link) {
        if (link[1].rel == 'next') {
          this.hasNext = true;
          return true;
        }
      }, this);
      return resp.data;
    }
  });

  repositories = new Repositories([], 'loicfrering');
  window.datagrid = new Backbone.Datagrid({
    collection: repositories,
    paginated: true,
    columns: []
  });

  datagrid.render().$el.appendTo('#datagrid');

})(Backbone);
