var ItemsPerPage = Datagrid.ItemsPerPage = Control.extend({
  events: {
    change: 'perPage'
  },

  initialize: function() {
    ItemsPerPage.__super__.initialize.apply(this, arguments);

    _.defaults(this.options, {
      increment: this.pager.get('perPage'),
      max:       4 * this.pager.get('perPage')
    });
  },

  render: function() {
    var $select   = $('<select></select>'), i,
        increment = this.options.increment,
        max       = this.options.max;

    for (i = increment; i <= max; i += increment) {
      $option = $('<option></option>');
      $option.html(i);
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
