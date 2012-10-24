define(['backbone', 'views/header', 'views/row'], function(Backbone, Header, Row) {

  var Paginator = Backbone.View.extend({
    className: 'pagination pagination-centered',

    initialize: function() {
      this.options = _.defaults(this.options, {
        current: 1
      });
    },

    render: function() {
      var $ul = $('<ul></ul>'), $li;

      $li = $('<li><a href="#">«</a></li>');
      if (this.options.current === 1) {
        $li.addClass('disabled');
      }
      $ul.append($li);

      for (var i = 1; i <= this.options.total; i++) {
        $li = $('<li></li>');
        if (i === this.options.current) {
          $li.addClass('active');
        }
        $li.append('<a href="#">' + i + '</a>');
        $ul.append($li);
      }

      $li = $('<li><a href="#">»</a></li>');
      if (this.options.current === this.options.total) {
        $li.addClass('disabled');
      }
      $ul.append($li);

      this.$el.append($ul);
      return this;
    }
  });

  return Paginator;

});
