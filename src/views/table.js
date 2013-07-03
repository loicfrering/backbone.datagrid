var Table = Datagrid.Table = ComposedView.extend({
  tagName: 'table',

  initialize: function(options) {
    this.options    = options;
    this.collection = this.options.collection;
    this.columns    = this.options.columns;
    this.pager      = this.options.pager;
    this.sorter     = this.options.sorter;

    this.listenTo(this.collection, 'reset', this.render);
  },

  render: function() {
    this.$el.empty();
    this.removeNestedViews();

    var header = new Header({columns: this.columns, sorter: this.sorter});
    this.$el.append(header.render().el);
    this.addNestedView(header);

    this.$el.append('<tbody></tbody>');

    if (this.collection.isEmpty()) {
      this.$el.append(this.options.emptyMessage);
    } else {
      this.collection.forEach(this.renderRow, this);
    }

    return this;
  },

  renderRow: function(model) {
    var options = {
      model: model,
      columns: this.columns
    };
    var rowClassName = this.options.rowClassName;
    if (_.isFunction(rowClassName)) {
      rowClassName = rowClassName(model);
    }
    options.className = rowClassName;

    var row = new Row(options);
    this.$('tbody').append(row.render(this.columns).el);
    this.addNestedView(row);
  }
});
