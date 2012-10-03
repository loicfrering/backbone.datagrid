define(['backbone', 'views/row'], function(Backbone, Row) {

  var Header = Backbone.View.extend({
    tagName: 'thead',

    initialize: function() {
      this.columns = this.options.columns;
    },

    render: function() {
      var model = new Backbone.Model();
      var headerColumn, columns = [];
      _.each(this.columns, function(column) {
        model.set(column.property, column.title);
        headerColumn      = _.clone(column);
        headerColumn.view = column.headerView;
        columns.push(headerColumn);
      }, this);

      row = new Row({model: model, columns: columns, header: true});
      this.$el.html(row.render().el);

      return this;
    }
  });

  return Header;

});
