var CallbackCell = Datagrid.CallbackCell = Cell.extend({
  initialize: function() {
    CallbackCell.__super__.initialize.call(this);
    this.callback = this.options.callback;
  },

  _prepareValue: function() {
    this.value = this.callback(this.model.toJSON());
  }
});
