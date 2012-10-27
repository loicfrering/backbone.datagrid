define(['backbone'], function(Backbone) {

  var Sorter = Backbone.Model.extend({
    sort: function(column) {
      if (this.get('column') === column) {
        this.togglerOrder();
      } else {
        this.set({
          column: column,
          order: Sorter.ASC
        });
      }
    },

    sortedBy: function(column) {
      return this.get('column') === column;
    },

    sortedASC: function() {
      return this.get('order') === Sorter.ASC;
    },

    sortedDESC: function() {
      return this.get('order') === Sorter.DESC;
    },

    togglerOrder: function() {
      if (this.get('order') === Sorter.ASC) {
        this.set('order', Sorter.DESC);
      } else {
        this.set('order', Sorter.ASC);
      }
    }
  });

  Sorter.ASC  = 'asc';
  Sorter.DESC = 'desc';

  return Sorter;

});
