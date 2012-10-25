chai.should();

describe('Pager', function() {
  var pager;

  beforeEach(function() {
    pager = new Pager({
      currentPage: 4,
      perPage: 10,
      total: 42
    });
  });

  describe('pagination', function() {
    it('should correctly calculate the total number of pages', function() {
      pager.get('totalPages').should.equal(5);

      pager.totalPages(24);
      pager.get('totalPages').should.equal(3);
    });

    it('should allow to go to a particular page', function() {
      pager.page(2);
      pager.get('currentPage').should.equal(2);
    });

    it('should not go to an unreachable page', function() {
      pager.page(0);
      pager.get('currentPage').should.equal(4);

      pager.page(6);
      pager.get('currentPage').should.equal(4);
    });

    it('should go to the next page', function() {
      pager.next();
      pager.get('currentPage').should.equal(5);

      pager.next();
      pager.get('currentPage').should.equal(5);
    });

    it('should go to the previous page', function() {
      pager.prev();
      pager.get('currentPage').should.equal(3);

      pager.prev();
      pager.get('currentPage').should.equal(2);
    });
  });

  describe('bindings', function() {
    it('should update totalPages when perPage changes', function() {
      pager.set('perPage', 20);
      pager.get('totalPages').should.equal(3);
    });

    it('should update totalPages when total changes', function() {
      pager.set('total', 64);
      pager.get('totalPages').should.equal(7);
    });
  });

  describe('validations', function() {
    it('should correctly test if a page is in bounds', function() {
      pager.inBounds(1).should.be.true;
      pager.inBounds(5).should.be.true;

      pager.inBounds(0).should.be.false;
      pager.inBounds(6).should.be.false;
    });

    it('should throw an error for an invalid perPage value', function() {
      (function() {
        new Pager({currentPage: 2, perPage: 0, total: 42});
      }).should.throw(Error);

      (function() {
        pager.set('perPage', -1);
      }).should.throw(Error);
    });
  });
});
