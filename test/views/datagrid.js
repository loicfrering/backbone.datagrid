chai.should();

describe('Datagrid', function() {
  describe('initialization', function() {
    var datagrid;

    beforeEach(function() {
      datagrid = new Datagrid({collection: new Backbone.Collection()});
    });

    it('should have div as tagName', function() {
      datagrid.tagName.should.equal('div');
    });

    it('should default page option to 1', function() {
      datagrid.options.page.should.equal(1);
    });

    it('should default perPage option to 10', function() {
      datagrid.options.perPage.should.equal(10);
    });

    it('should throw an error when perPage is less than 1', function() {
      (function() {
        datagrid = new Datagrid({
          collection: new Backbone.Collection(),
          paginated:  true,
          perPage:    0
        });
      }).should.throw(Error);

      (function() {
        datagrid = new Datagrid({
          collection: new Backbone.Collection(),
          paginated:  true,
          perPage:    -1
        });
      }).should.throw(Error);
    });
  });

  describe('default columns', function() {
    var datagrid;

    beforeEach(function() {
      var collection = new Backbone.Collection({col1: 'val1', col2: 'val2', col3: 'val3', col4: 'val4'});
      datagrid       = new Datagrid({collection: collection});
    });

    it('should set to default all columns if no definition has been passed', function() {
      datagrid.columns.length.should.equal(4);
      for (var i = 0; i < 4; i++) {
        datagrid.columns[i].property.should.equal('col' + (i + 1));
      }
    });

    it('should have a default title correctly cased.', function() {
      for (var i = 0; i < 4; i++) {
        datagrid.columns[i].title.should.equal('Col' + (i + 1));
      }
    });
  });

  describe('columns preparation', function() {
    var datagrid;

    beforeEach(function() {
      var collection = new Backbone.Collection();
      var columns    = [{
        property: 'col1',
        title:    'Column 1'
      }, 'col2', {
        property: 'col3'
      }];
      datagrid = new Datagrid({collection: collection, columns: columns});
    });

    it('shouldn\'t touch the column if completely defined', function() {
      var column = datagrid.columns[0];
      column.should.deep.equal({
        property: 'col1',
        title:    'Column 1'
      });
    });

    it('should prepare all the columns defined', function() {
      datagrid.columns.length.should.equal(3);
      datagrid.columns.forEach(function(column) {
        column.should.be.an('object');
      });
    });

    it('should manage a string column definition', function() {
      var column = datagrid.columns[1];
      column.should.be.an('object');
      column.property.should.equal('col2');
      column.title.should.equal('Col2');
    });

    it('should set a default title if not defined', function() {
      var column = datagrid.columns[2];
      column.title.should.equal('Col3');
    });

  });

  describe('pagination', function() {
    it('should paginate correctly in memory', function() {
      var collection = new Backbone.Collection();
      for (var i = 0; i < 5; i++) {
        collection.push({foo: 'bar' + i});
      }
      var datagrid = new Datagrid({
        collection: collection,
        paginated:  true,
        inMemory:   true,
        perPage:    2
      });

      datagrid.page(2, {silent: true});

      datagrid.collection.size().should.equal(2);
      datagrid.collection.at(0).toJSON().should.deep.equal({foo: 'bar2'});
      datagrid.collection.at(1).toJSON().should.deep.equal({foo: 'bar3'});
    });
  });

});
