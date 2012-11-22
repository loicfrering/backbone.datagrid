describe('HeaderCell', function() {
  var headerCell;

  beforeEach(function() {
    headerCell = new Datagrid.HeaderCell({sorter: new Datagrid.Sorter(), column: {property: 'foo', sortable: true}});
  });

  describe('initialization', function() {
    it('should have a column definition', function() {
      headerCell.column.should.exist;
      headerCell.column.should.deep.equal({property: 'foo', sortable: true});
    });

    it('should have a sorter', function() {
      headerCell.sorter.should.exist;
    });
  });

  describe('sorting', function() {
    it('should update the sorter when sorting', function() {
      headerCell.sort();

      headerCell.sorter.get('column').should.equal('foo');
    });

    it('should sort using sortedProperty instead of property if defined', function() {
      headerCell.column.sortedProperty = 'bar';
      headerCell.sort();

      headerCell.sorter.get('column').should.equal('bar');
    });
  });
});
