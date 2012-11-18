(function(Backbone) {

  var Repositories = Backbone.Collection.extend({
    initialize: function(models, user) {
      this.user = user;
    },

    url: function() {
      return 'https://api.github.com/users/' + this.user + '/repos?callback=?';
    },

    parse: function(resp) {
      var link = _.find(resp.meta.Link, function(link) {
        return link[1].rel === 'last';
      });
      if (link) {
        var lastPage = link[0].match(/page=(\d+)/)[1];
        var perPage  = link[0].match(/per_page=(\d+)/)[1];
        this.total = lastPage * perPage;
      }
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
