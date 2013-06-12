var Table = Datagrid.Table = Backbone.View.extend({
  tagName: 'table',

  initialize: function(options) {
    this.options    = options;
    this.collection = this.options.collection;
    this.columns    = this.options.columns;
    this.sorter     = this.options.sorter;

    this.subviews = [];
  },

  render: function() {
    var header = new Header({columns: this.columns, sorter: this.sorter});
    this.$el.append(header.render().el);
    this.subviews.push(header);

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
    this.subviews.push(row);
  },

  remove: function() {
    Table.__super__.remove.call(this);

    _.each(this.subviews, function(subview) {
      subview.remove();
    });

    return this;
  }
});
