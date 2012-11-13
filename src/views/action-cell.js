var ActionCell = Datagrid.ActionCell = Cell.extend({
  initialize: function() {
    ActionCell.__super__.initialize.call(this);
  },

  action: function() {
    return this.options.action(this.model);
  },

  _prepareValue: function() {
    var a = $('<a></a>');

    a.html(this.options.label);
    a.attr('href', this.options.href || '#');
    if (this.options.actionClassName) {
      a.addClass(this.options.actionClassName);
    }
    if (this.options.action) {
      this.delegateEvents({
        'click a': this.action
      });
    }

    this.value = a;
  }
});
