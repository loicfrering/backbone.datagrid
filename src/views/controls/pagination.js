var Pagination = Datagrid.Pagination = Control.extend({
  className: 'pagination pagination-centered',

  events: {
    'click li:not(.disabled) a': 'page',
    'click li.disabled a': function(e) { e.preventDefault(); }
  },

  initialize: function() {
    Pagination.__super__.initialize.apply(this, arguments);
    _.defaults(this.options, {
      full: true
    });

    this.listenTo(this.pager, 'change', this.render);
  },

  render: function() {
    var $ul = $('<ul></ul>'), $li;

    $li = $('<li class="prev"><a href="#">«</a></li>');
    if (!this.pager.hasPrev()) {
      $li.addClass('disabled');
    }
    $ul.append($li);

    if (this.options.full && this.pager.hasTotal()) {
      for (var i = 1; i <= this.pager.get('totalPages'); i++) {
        $li = $('<li></li>');
        if (i === this.pager.get('currentPage')) {
          $li.addClass('active');
        }
        $li.append('<a href="#">' + i + '</a>');
        $ul.append($li);
      }
    }

    $li = $('<li class="next"><a href="#">»</a></li>');
    if (!this.pager.hasNext()) {
      $li.addClass('disabled');
    }
    $ul.append($li);

    this.$el.html($ul);
    return this;
  },

  page: function(event) {
    var $target = $(event.target), page;
    if ($target.parent().hasClass('prev')) {
      this.pager.prev();
    } else if ($target.parent().hasClass('next')) {
      this.pager.next();
    }
    else {
      this.pager.page(parseInt($(event.target).html(), 10));
    }
    return false;
  }
});
