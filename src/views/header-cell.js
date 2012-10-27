define(['backbone', 'views/cell'], function(Backbone, Cell) {

  var HeaderCell = Cell.extend({
    initialize: function() {
      HeaderCell.__super__.initialize.call(this);
    },

    render: function() {
      this._prepareValue();
      var html = this.value;
      if (this.column.sortable) {
        this.$el.addClass('sortable');
        this.delegateEvents({click: 'sort'});
        html += ' <i class="icon-minus pull-right"></i>';
      }
      this.$el.html(html);
      return this;
    },

    sort: function() {
      console.log('Sorting...');
    }
  });

  return HeaderCell;

});
