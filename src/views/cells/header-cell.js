var HeaderCell = Datagrid.HeaderCell = Cell.extend({
  initialize: function() {
    HeaderCell.__super__.initialize.apply(this, arguments);

    this.sorter = this.options.sorter;

    if (this.column.sortable) {
      this.delegateEvents({click: 'sort'});
    }
  },

  render: function() {
    this._prepareValue();
    var html = this.value, icon;

    if (this.column.sortable) {
      this.$el.addClass('sortable');
      if (this.sorter.sortedBy(this.column.sortedProperty || this.column.property) || this.sorter.sortedBy(this.column.index)) {
        if (this.sorter.sortedASC()) {
          icon = 'icon-chevron-up';
        } else {
          icon = 'icon-chevron-down';
        }
      } else {
        icon = 'icon-minus';
      }

      html += ' <i class="' + icon + ' pull-right"></i>';
    }

    this.$el.html(html);
    return this;
  },

  sort: function() {
    this.sorter.sort(this.column.sortedProperty || this.column.property);
  }
});
