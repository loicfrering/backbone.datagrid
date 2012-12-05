(function(Backbone) {

  var $alert    = $('#alert');
  var $progress = $('#progress');
  var $datagrid = $('#datagrid');

  var Repositories = Backbone.Collection.extend({
    url: function() {
      return 'https://api.github.com/users/' + this.user + '/repos?callback=?';
    },

    data: function(pager, sorter) {
      return {
        per_page:  pager.get('perPage'),
        page:      pager.get('currentPage'),
        sort:      sorter.get('column'),
        direction: sorter.get('order')
      };
    },

    parse: function(resp) {
      this.hasNext = false;
      if (resp.meta.status === 404) {
        $alert.html('User <strong>' + this.user + '</strong> not found.').show();
      } else if (resp.meta.status === 200) {
        var link = _.find(resp.meta.Link || [], function(link) {
          if (link[1].rel == 'next') {
            this.hasNext = true;
            return true;
          }
        }, this);
        return resp.data;
      } else {
        $alert.html(resp.data.message).show();
      }
    }
  });

  repositories = new Repositories();
  window.datagrid = new Backbone.Datagrid({
    collection: repositories,
    paginated: true,
    columns: [
      'name',
      'language',
      'watchers',
      'forks', {
        property:       'pushed_at',
        sortable:       true,
        sortedProperty: 'pushed',
        view: function(repo) {
          return new Date(repo.pushed_at).toLocaleDateString();
        }
      }, {
        property: 'html_url',
        view: '<a class="btn btn-primary" href="<%= html_url %>">Go &gt;&gt;</a>'
      }
    ]
  });

  $datagrid.append(datagrid.$el);
  repositories.on('reset', function() {
    $progress.hide();
    $datagrid.show();
  });

  $('form').submit(function() {
    repositories.user = $('input').val();
    $alert.hide();
    $progress.show();
    $datagrid.hide();
    datagrid.page(1);
    return false;
  });

})(Backbone);
