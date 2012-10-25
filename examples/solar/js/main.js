require.config({
  shim: {
    underscore: {
      exports: '_'
    },
    handlebars: {
      exports: 'Handlebars'
    },
    backbone: {
      deps: [
        'underscore',
        'jquery'
      ],
      exports: 'Backbone'
    }
  },
  paths: {
    jquery: 'libs/jquery.min',
    underscore: 'libs/underscore.min',
    backbone: 'libs/backbone',
    handlebars: 'libs/handlebars',
    text: 'libs/text',
    datagrid: '../../../src/views/datagrid',
    'views/header': '../../../src/views/header',
    'views/row': '../../../src/views/row',
    'views/cell': '../../../src/views/cell',
    'views/callback-cell': '../../../src/views/callback-cell',
    'views/pagination': '../../../src/views/pagination',
    'models/pager': '../../../src/models/pager'
  },
  config: {
    hbs: {
      extension: 'hbs'
    }
  }
});

require(['backbone', 'datagrid'], function(Backbone, Datagrid) {

  // Fixtures

  var fixtures = [];

  var earth = {
    name:    'Earth',
    rank:    3,
    radius:  6371,
    volume:  1083.21,
    mass:    5973.6,
    density: 5.515,
    gravity: 9.78033
  };

  var mars = {
    name:    'Mars',
    rank:    4,
    radius:  3390,
    volume:  163.18,
    mass:    641.85,
    density: 3.94,
    gravity: 3.7
  };

  var jupiter = {
    name:    'Jupiter',
    rank:    5,
    radius:  69911,
    volume:  1431280,
    mass:    1898600,
    density: 1.33,
    gravity: 24.79
  };
  fixtures.push(earth, mars, jupiter);


  var Planet = Backbone.Model.extend();

  var Planets = Backbone.Collection.extend({
    model: Planet
  });


  window.planets = new Planets();
  planets.reset(fixtures);

  window.datagrid1 = new Datagrid({
    collection: planets.clone(),
    inMemory: true
  });

  window.datagrid2 = new Datagrid({
    collection: planets,
    inMemory: true,
    paginated: true,
    rowClassName: function(planet) { return planet.get('name') === 'Mars' ? 'error' : ''; },
    columns: [{
      title: 'Le nom',
      property: 'name',
      header: true
    }, 'gravity', {
      title: 'Le Rayon',
      property: 'radius',
      cellClassName: 'test',
      view: '<%= radius %> km'
    }, {
      property: 'rank',
      view: function(model) {
        var rank = model.rank;
        switch(rank % 10) {
          case 1: suffix = 'st'; break;
          case 2: suffix = 'nd'; break;
          case 3: suffix = 'rd'; break;
          default: suffix = 'th';
        }
        if (10 < rank && rank < 13) {
          return rank + 'th';
        }
        return rank + suffix;
      }
    }]
  });

  datagrid1.render().$el.appendTo('#datagrid');
  datagrid2.render().$el.appendTo('#datagrid');

});
