var Header = Backbone.View.extend({
  tagName: 'thead',

  initialize: function() {
    this.columns = this.options.columns;
    this.sorter  = this.options.sorter;
  },

  render: function() {
    var model = new Backbone.Model();
    var headerColumn, columns = [];
    _.each(this.columns, function(column, i) {
      headerColumn          = _.clone(column);
      headerColumn.property = column.property || column.index;
      headerColumn.view     = column.headerView || {
          type: HeaderCell,
          sorter: this.sorter
        };

      model.set(headerColumn.property, column.title);
      columns.push(headerColumn);
    }, this);

    var row = new Row({model: model, columns: columns, header: true});
    this.$el.html(row.render().el);

    return this;
  }
});
