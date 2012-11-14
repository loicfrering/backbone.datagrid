(function(Backbone) {

  var Repositories = Backbone.Collection.extend({
    initialize: function(models, user) {
      this.user = user;
    },

    url: function() {
      return 'https://api.github.com/users/' + this.user + '/repos?callback=?';
    },

    parse: function(resp) {
      return resp.data;
    }
  });

  repositories = new Repositories([], 'loicfrering');
  repositories.fetch({success: function() {
    window.datagrid = new Backbone.Datagrid({
      collection: repositories,
      paginated: true,
      columns: []
    });

    datagrid.render().$el.appendTo('#datagrid');
  }});

})(Backbone);
