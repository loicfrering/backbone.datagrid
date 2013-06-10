var ItemsPerPage = Datagrid.ItemsPerPage = Backbone.View.extend({
  events: {
    change: 'perPage'
  },

  initialize: function() {
    this.pager = this.options.pager;
  },

  render: function() {
    var $select = $('<select></select>'), i;

    for (i = 0; i < 4; i++) {
      $option = $('<option></option>');
      $option.html(10*i);
      $select.append($option);
    }

    this.$el.html($select);
    return this;
  },

  perPage: function(event) {
    var perPage = $(event.target).val();
    this.pager.set('perPage', perPage);
  }
});
