var TemplateCell = Datagrid.TemplateCell = CallbackCell.extend({

  _prepareValue: function() {
    this.value = this.callback(this.model.toJSON());
  }
});
