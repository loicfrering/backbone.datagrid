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
    'views/cell': '../../../src/views/cell'
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
    model: Planet,
    fetch: function() {
      this.reset(fixtures);
    }
  });


  window.planets = new Planets();
  planets.fetch();

  window.datagrid1 = new Datagrid({
    collection: planets,
    className: 'table'
  });

  window.datagrid2 = new Datagrid({
    collection: planets,
    className: 'table',
    columns: [{
      name: 'Le nom',
      property: 'name'
    }, {
      name: 'Le rang',
      property: 'rank'
    }]
  });

  datagrid1.render().$el.appendTo('#datagrid');
  datagrid2.render().$el.appendTo('#datagrid');

});
