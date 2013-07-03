describe('Row', function() {
  describe('constructor', function() {
    it('should have tr as tagName', function() {
      var row = new Datagrid.Row({model: new Backbone.Model()});
      row.tagName.should.equal('tr');
    });
  });

  describe('cell view resolution', function() {
    var row;

    beforeEach(function() {
      row = new Datagrid.Row({model: new Backbone.Model({foo: 'bar'})});
    });

    it('should instantiate a cell view with correct common options', function() {
      var view = row._resolveCellView({title: 'Column 1', property: 'col1'});

      view.should.have.a.property('model')
        .that.is.an('object')
        .with.property('attributes')
          .that.deep.equals({foo: 'bar'});

      view.should.have.a.property('column')
        .that.is.an('object')
        .that.deep.equals({title: 'Column 1', property: 'col1'});
    });

    it('should instantiate a cell view with a th tagName if the cell is a header', function() {
      var view = row._resolveCellView({header: true});
      view.tagName.should.equal('th');
    });

    it('should default to a simple Cell view', function() {
      var view = row._resolveCellView({});
      view.should.be.an.instanceof(Datagrid.Cell);
    });

    it('should default render view from serialized model', function() {
      var view = row._resolveCellView({property: 'foo'});
      view.should.be.an.instanceof(Datagrid.Cell);
      view.render().$el.html().should.contain('bar');
    });

    it('should resolve to callback view with an underscore template function for a string', function() {
      var view = row._resolveCellView({view: 'Hello <%= col1 %>'});

      view.should.be.an.instanceof(Datagrid.CallbackCell)
        .and.have.a.property('callback')
          .that.is.a('function');
      view.callback({col1: 'World'}).should.equal('Hello World');
    });

    it('should resolve to callback view with the specified function for a function', function() {
      var view = row._resolveCellView({view: function() { return 'Hello!'; }});

      view.should.be.an.instanceof(Datagrid.CallbackCell)
        .and.have.a.property('callback')
          .that.is.a('function');
      view.callback().should.equal('Hello!');
    });

    it('should view model be passed as parameter when callback view is a function', function() {
      var view = row._resolveCellView({view: function(model) { return model.get('foo'); }});

      view.should.be.an.instanceof(Datagrid.CallbackCell)
        .and.have.a.property('callback')
          .that.is.a('function');

      view.render().$el.html().should.contain('bar');
    });

    it('should throw an error for an invalid non-custom view', function() {
      (function() {
        row._resolveCellView({view: 42});
      }).should.throw(TypeError);
    });

    it('should resolve to a custom view with custom options for an object', function() {
      var MyCellView = function(options) { this.options = options; };
      MyCellView.prototype.render = function() {};
      var view = row._resolveCellView({view: {
        type: MyCellView,
        foo: 'bar',
        hello: true
      }});

      view.should.be.an.instanceof(MyCellView);
      view.should.have.a.deep.property('options.foo').that.equal('bar');
      view.should.have.a.deep.property('options.hello').that.is.true;
    });

    it('should throw an error when custom view\'s type is not defined', function() {
      (function() {
        row._resolveCellView({view: { foo: 'bar' }});
      }).should.throw(TypeError);
    });

    it('should throw an error when custom view is not a Backbone.View', function() {
      var MyCellView = function(options) { this.options = options; };

      (function() {
        row._resolveCellView({view: { type: MyCellView, foo: 'bar' }});
      }).should.throw(TypeError);
    });
  });

});
