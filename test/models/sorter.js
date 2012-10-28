chai.should();

describe('Sorter', function() {
  var sorter;

  beforeEach(function() {
    sorter = new Sorter();
  });

  describe('sorting', function() {
    it('should expose ASC and DESC constants', function() {
      Sorter.ASC.should.equal('asc');
      Sorter.DESC.should.equal('desc');
    });

    it('should sort with ascending order by default', function() {
      sorter.sort('foo');

      sorter.get('column').should.equal('foo');
      sorter.get('order').should.equal(Sorter.ASC);
    });

    it('should sort with adequate order when specified', function() {
      sorter.sort('foo', Sorter.DESC);

      sorter.get('column').should.equal('foo');
      sorter.get('order').should.equal(Sorter.DESC);
    });

    it('should toggle the order when sorting on the already sorted column', function() {
      sorter.sort('foo');
      sorter.get('order').should.equal(Sorter.ASC);

      sorter.sort('foo');
      sorter.get('order').should.equal(Sorter.DESC);

      sorter.sort('foo');
      sorter.get('order').should.equal(Sorter.ASC);
    });

    it('should allow to test if a column is the one we are currently sorting on', function() {
      sorter.sort('foo');

      sorter.sortedBy('foo').should.be.true;
      sorter.sortedBy('bar').should.be.false;
    });

    it('should allow to test if current sorting is ascending', function() {
      sorter.sort('foo', Sorter.ASC);
      sorter.sortedASC().should.be.true;

      sorter.sort('foo', Sorter.DESC);
      sorter.sortedASC().should.be.false;
    });

    it('should allow to test if current sorting is descending', function() {
      sorter.sort('foo', Sorter.DESC);
      sorter.sortedDESC().should.be.true;

      sorter.sort('foo', Sorter.ASC);
      sorter.sortedDESC().should.be.false;
    });

    it('should be able to toggle the sorting order', function() {
      sorter.set('order', Sorter.ASC);

      sorter.toggleOrder();
      sorter.get('order').should.equal(Sorter.DESC);

      sorter.toggleOrder();
      sorter.get('order').should.equal(Sorter.ASC);
    });
  });
});
