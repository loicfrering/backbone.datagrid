describe('Datagrid', function() {
  describe('initialization', function() {
    var datagrid;

    beforeEach(function() {
      datagrid = new Datagrid({collection: new Backbone.Collection(), inMemory: true});
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

    it('should default tableClassName option to "table"', function() {
      datagrid.options.tableClassName.should.equal('table');
    });

    it('should default emptyMessage option to "No results found."', function() {
      datagrid.options.emptyMessage.should.equal('<p>No results found.</p>');
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
      datagrid       = new Datagrid({collection: collection, inMemory: true});
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
    var datagrid, columns, collection;
    var comparator = function(model1, model2) { return 0; };

    beforeEach(function() {
      collection = new Backbone.Collection();
      columns    = [{
        property:   'col1',
        title:      'Column 1',
        comparator: comparator
      }, 'col2', {
        property: 'my_col_3',
        sortable: true
      }];
      datagrid = new Datagrid({collection: collection, columns: columns, inMemory: true});
    });

    it('shouldn\'t touch the column if completely defined', function() {
      var column = datagrid.columns[0];
      column.should.deep.equal({
        index:      0,
        property:   'col1',
        title:      'Column 1',
        comparator: comparator
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

    it('should set the index for each column', function() {
      datagrid.columns.forEach(function(column, i) {
        column.index.should.equal(i);
      });
    });

    it('should set a default title if not defined', function() {
      var column = datagrid.columns[2];
      column.title.should.equal('My Col 3');
    });

    it('should set a default comparator if not defined', function() {
      should.not.exist(datagrid.columns[1].comparator);
      datagrid.columns[2].comparator.should.exist;
    });

    it('should throw an error for a column with no property and no custom view.', function() {
      columns.push({
        title: 'Invalid column'
      });
      (function() {
        new Datagrid({collection: collection, columns: columns});
      }).should.throw(Error);
    });

    it('should throw an error for an invalid sortable column', function() {
      columns.push({
        title:    'Invalid sortable',
        sortable: true
      });
      (function() {
        new Datagrid({collection: collection, columns: columns});
      }).should.throw(Error);
    });
  });

  describe('pagination', function() {
    var datagrid;

    beforeEach(function() {
      var collection = new Backbone.Collection();
      for (var i = 0; i < 5; i++) {
        collection.push({foo: 'bar' + i});
      }
      datagrid = new Datagrid({
        collection: collection,
        paginated:  true,
        inMemory:   true,
        perPage:    2
      });
    });

    it('should paginate correctly in memory', function() {
      datagrid.page(2, {silent: true});

      datagrid.pager.get('currentPage').should.equal(2);
      datagrid.collection.size().should.equal(2);
      datagrid.collection.at(0).toJSON().should.deep.equal({foo: 'bar2'});
      datagrid.collection.at(1).toJSON().should.deep.equal({foo: 'bar3'});
    });

    it('should update the datagrid when perPage changes', function() {
      datagrid.page(2, {silent: true});
      datagrid.pager.get('currentPage').should.equal(2);

      datagrid.perPage(1);

      datagrid.pager.get('currentPage').should.equal(1);
      datagrid.collection.size().should.equal(1);
      datagrid.collection.at(0).toJSON().should.deep.equal({foo: 'bar0'});
    });

    it('should use sensible defaults for request data', function() {
      datagrid.pager.set('perPage', 2);
      datagrid.pager.set('currentPage', 4);
      var data = datagrid._getRequestData();

      should.exist(data.per_page);
      data.per_page.should.equal(2);
      should.exist(data.page);
      data.page.should.equal(4);
    });

    it('should allow to specify request data via an object', function() {
      datagrid.collection.data = {
        per_page: 10,
        page:     function(pager) { return pager.get('currentPage'); }
      };
      datagrid.pager.set('currentPage', 4);

      var data = datagrid._getRequestData();
      data.per_page.should.equal(10);
      data.page.should.equal(4);
    });

    it('should allow to specify request data via a function', function() {
      datagrid.collection.data = function(pager) {
        return {
          per_page: 10,
          page:     pager.get('currentPage')
        };
      };
      datagrid.pager.set('currentPage', 4);

      var data = datagrid._getRequestData();
      data.per_page.should.equal(10);
      data.page.should.equal(4);
    });
  });

  describe('sorting', function() {
    var datagrid, datagridOptions;

    beforeEach(function() {
      var collection = new Backbone.Collection([
        {foo: 'bar0', rank: 'fourth'},
        {foo: 'bar1', rank: 'first'},
        {foo: 'bar2', rank: 'fifth'},
        {foo: 'bar3', rank: 'third'},
        {foo: 'bar4', rank: 'second'}
      ]);
      datagridOptions = {
        collection: collection,
        inMemory:   true,
        perPage:    2,
        columns:    [{
          property: 'foo',
          sortable: true
        }, {
          property: 'rank',
          sortable: true,
          comparator: function(model1, model2) {
            var order = {first: 1, second: 2, third: 3, fourth: 4, fifth: 5};
            return order[model1.get('rank')] - order[model2.get('rank')];
          }
        }]
      };
    });

    it('should sort correctly in memory with a default alphabetical comparator', function() {
      datagrid = new Datagrid(datagridOptions);
      datagrid.sort('foo');

      datagrid.sorter.get('column').should.equal('foo');
      datagrid.sorter.get('order').should.equal(Datagrid.Sorter.ASC);
      datagrid.collection.size().should.equal(5);
      datagrid.collection.toJSON().should.deep.equal([
        {foo: 'bar0', rank: 'fourth'},
        {foo: 'bar1', rank: 'first'},
        {foo: 'bar2', rank: 'fifth'},
        {foo: 'bar3', rank: 'third'},
        {foo: 'bar4', rank: 'second'}
      ]);

      datagrid.sort('foo');

      datagrid.sorter.get('column').should.equal('foo');
      datagrid.sorter.get('order').should.equal(Datagrid.Sorter.DESC);
      datagrid.collection.size().should.equal(5);
      datagrid.collection.toJSON().should.deep.equal([
        {foo: 'bar4', rank: 'second'},
        {foo: 'bar3', rank: 'third'},
        {foo: 'bar2', rank: 'fifth'},
        {foo: 'bar1', rank: 'first'},
        {foo: 'bar0', rank: 'fourth'}
      ]);
    });

    it('should be able to sort undefined attributes with the default comparator', function() {
      datagrid.collection.add({rank: 'undefined'});
      datagrid.sort('foo');

      datagrid.collection.toJSON().should.deep.equal([
        {rank: 'undefined'},
        {foo: 'bar0', rank: 'fourth'},
        {foo: 'bar1', rank: 'first'},
        {foo: 'bar2', rank: 'fifth'},
        {foo: 'bar3', rank: 'third'},
        {foo: 'bar4', rank: 'second'}
      ]);

      datagrid.sort('foo');

      datagrid.collection.toJSON().should.deep.equal([
        {foo: 'bar4', rank: 'second'},
        {foo: 'bar3', rank: 'third'},
        {foo: 'bar2', rank: 'fifth'},
        {foo: 'bar1', rank: 'first'},
        {foo: 'bar0', rank: 'fourth'},
        {rank: 'undefined'}
      ]);
    });

    it('should sort correctly a paginated datagrid', function() {
      datagridOptions.paginated = true;
      datagrid = new Datagrid(datagridOptions);
      datagrid.page(2);
      datagrid.sort('foo', Datagrid.Sorter.DESC);

      datagrid.pager.get('currentPage').should.equal(1);
      datagrid.sorter.get('column').should.equal('foo');
      datagrid.sorter.get('order').should.equal(Datagrid.Sorter.DESC);
      datagrid.collection.size().should.equal(2);
      datagrid.collection.toJSON().should.deep.equal([
        {foo: 'bar4', rank: 'second'},
        {foo: 'bar3', rank: 'third'}
      ]);

      datagrid.page(2);
      datagrid.collection.toJSON().should.deep.equal([
        {foo: 'bar2', rank: 'fifth'},
        {foo: 'bar1', rank: 'first'}
      ]);

      datagrid.page(3);
      datagrid.collection.toJSON().should.deep.equal([
        {foo: 'bar0', rank: 'fourth'}
      ]);
    });

    it('should use a custom comparator when specified', function() {
      datagrid = new Datagrid(datagridOptions);
      datagrid.sort('rank');

      datagrid.sorter.get('column').should.equal('rank');
      datagrid.sorter.get('order').should.equal(Datagrid.Sorter.ASC);
      datagrid.collection.size().should.equal(5);
      datagrid.collection.toJSON().should.deep.equal([
        {foo: 'bar1', rank: 'first'},
        {foo: 'bar4', rank: 'second'},
        {foo: 'bar3', rank: 'third'},
        {foo: 'bar0', rank: 'fourth'},
        {foo: 'bar2', rank: 'fifth'}
      ]);
    });
  });

  describe('rendering', function() {
    var datagrid;

    it('should display an empty message when the collection is empty', function() {
      datagrid = new Datagrid({
        collection: new Backbone.Collection(),
        inMemory: true,
        emptyMessage: '<p>There are no foos</p>'
      });

      datagrid.render();

      datagrid.$('table tbody tr').size().should.equal(0);
      datagrid.$el.html().should.contain('<p>There are no foos</p>');
    });

  });

  describe('collection events', function() {
    var datagrid,
        collection = new Backbone.Collection();

    it('should refresh the grid on collection reset', function() {
      collection.reset([
          {col1: 'val1', col2: 'val2', col3: 'val3', col4: 'val4'},
      ]);

      datagrid = new Datagrid({
        collection: collection,
        inMemory: true,
      });

      datagrid.$el.html().should.not.contain('val21')

      collection.reset([
          {col1: 'val1', col2: 'val2', col3: 'val3', col4: 'val4'},
          {col1: 'val21', col2: 'val22', col3: 'val23', col4: 'val24'}
      ]);

      datagrid.$el.html().should.contain('val21')

    });

    it('should add a new row when pushing a model to the collection', function() {
      collection.reset([
          {col1: 'val1', col2: 'val2', col3: 'val3', col4: 'val4'},
      ]);

      datagrid = new Datagrid({
        collection: collection,
        inMemory: true,
      });

      collection.add([
          {col1: 'val21', col2: 'val22', col3: 'val23', col4: 'val24'}
      ]);

      datagrid.$el.html().should.contain('val21')

    });

  });
});
