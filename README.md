Backbone.Datagrid
=================

[Backbone.Datagrid](http://loicfrering.github.com/backbone.datagrid/) is a
powerful component, based on Backbone.View, that displays your Backbone
collections in a dynamic datagrid table. It is highly customizable and
configurable with sensible defaults.

You can refer to the [project's website](http://loicfrering.github.com/backbone.datagrid/)
for a nice HTML documentation.

[![Build Status](https://secure.travis-ci.org/loicfrering/backbone.datagrid.png)](http://travis-ci.org/loicfrering/backbone.datagrid)

Download
--------

The raw sources can be navigated on [GitHub](https://github.com/loicfrering/backbone.datagrid).
The distributed sources can be found in the `dist/` directory or
downloaded directly via one of the following links:

* Production minified version: [backbone.datagrid.min.js (v0.3.1)](https://raw.github.com/loicfrering/backbone.datagrid/v0.3.1/dist/backbone.datagrid.min.js).
* Development version: [backbone.datagrid.js (v0.3.1)](https://raw.github.com/loicfrering/backbone.datagrid/v0.3.1/dist/backbone.datagrid.js).

Getting started
---------------

### Usage

Create a new datagrid with your collection and options, render it and attach
the resulting element to your document:

```javascript
var myCollection = new MyCollection();
var datagrid = new Backbone.Datagrid({
  collection: myCollection
});
$('#datagrid').html(datagrid.el);
```

### Examples

You will find all the examples listed on [this page](http://loicfrering.github.com/backbone.datagrid/examples/). Their sources
are available in the [examples](https://github.com/loicfrering/backbone.datagrid/tree/master/examples/)
directory of the repository.

* Solar: a simple and complete example with an in memory collection of planets from the
  Solar System.
  * [Live version](http://loicfrering.github.com/backbone.datagrid/examples/solar.html)
  * [Sources](https://github.com/loicfrering/backbone.datagrid/tree/master/examples/js/solar.js)
* GitHub: an example with a collection connected to GitHub's REST API.
  * [Live version](http://loicfrering.github.com/backbone.datagrid/examples/github.html)
  * [Sources](https://github.com/loicfrering/backbone.datagrid/tree/master/examples/js/github.js)

Description
-----------

Each component composing the datagrid really are Backbone views. Here is a
description of these different components. You'll also find for each component
(or view), the events that will cause a rendering of the view.

                      Datagrid
     ____________________/\____________________
    /                                          \

    +----------+----------+----------+----------+  ˥
    | Column 1 | Column 2 | Column 3 | Column 4 |   } Header
    ǂ==========ǂ==========ǂ==========ǂ==========ǂ  ˩
    | Val 1-1  | Val 1-2  | Val 1-3  | Val 1-4  |
    +----------+----------+----------+----------+  ˥
    | Val 2-1  | Val 2-2  | Val 2-3  | Val 2-4  |   } Row
    +----------+---------\+----------+----------+  ˩
    | Val 3-1  | Val 3-2  \ Val 3-3  | Val 3-4  |
    +----------+----------+\--------\+----------+
    | Val 4-1  | Val 4-2  | \al 4-3  \ Val 4-4  |
    +----------+----------+--\-------+\---------+
                              \___  ___\
                                  \/
                                2 Cells

              +---+---+---+---+---+---+  ˥
              | « | 1 | 2 | 3 | 4 | » |   } Pagination
              +---+---+---+---+---+---+  ˩

### Datagrid

The backbone.datagrid entry point. A Backbone.View that will be responsible for
the entire datagrid management and rendering. It uses the collection passed to
the constructor as its data source. The Datagrid view takes care of creating
the `table` HTML element and each of the components described below.

Event bindings:

* collection#reset will cause a rendering of the whole datagrid.

### Header

A Backbone.View for the datagrid's header which is going to render the `thead`
HTML element. It is also responsible for creating a Cell for each column's
header.

### Row

A Backbone.View for each row of the datagrid. The Row is responsible for
rendering a row in the table, that is to say a `tr` HTML element, and for
creating a Cell for each column of the datagrid. The Row uses an entry of the
collection: a model.

Event bindings:

* model#change will cause a rendering of the row.

### Cell

A Backbone.View for each cell in a Row. One Cell is responsible for rendering a
`td` (or `th` for a header) HTML element.

There are specialized cells views extending the base Cell and that allows
custom renderings that suit your needs:

* Cell
  * CallbackCell
    * TemplateCell (not available yet)
      * UnderscoreTemplateCell (not available yet)
      * HandlebarsTemplateCell (not available yet)
  * ActionCell

Datagrid options
----------------

### collection

The Backbone.Collection that is going to be managed by the datagrid.

### inMemory

If the collection should be manipulated in memory for pagination and sorting.
Otherwise use REST requests.

### paginated

Whether or not the datagrid should be paginated.

### tableClassName

The class attribute for the generated `table`.

### rowClassName

The class attribute for each datagrid's row: `tr` tags. Can be a simple string
with class names space-separated or a computed string by passing a callback
function. The callback function will be called with the model associated to the
current row.

### columns

The columns definitions, see the dedicated section below.

Columns definitions
-------------------

You can customize the datagrid with columns definition. It is an array of
definitions, one for each column you want to see in the datagrid. If no
definition is passed to the datagrid, a default column definition is going to
be created for you for each property of the model managed by the collection you
passed to the datagrid.

A column definition can be a string or an object. If a string is passed, a
default column definition will be generated with the specified string used as
the column's property.

### Column definition

#### property (string)

The model's property that is going to be displayed in the column. Can be
omitted if the column describe a combination of different properties of the
model: please refer to custom views below.

#### title (string)

The title of the column which will be displayed in the table header. If not
defined, the column's property will be used for generating a nicely formated
title, here are some examples:

* name => Name
* events_url => Events Url
* issue_events_url => Issue Events Url

#### sortable (boolean)

Whether or not the column is sortable. Default to false.

#### sortBy (string)

The column which will be used for sorting, see dedicated sorting section below
for more details.

#### comparator (function)

If the column is sortable, a comparator function that is going to be used to sort the
datagrid by the column. See the dedicated sorting section below for more
informations.

#### cellClassName (string|callback)

The class name of the cell (td or th). It can be a string or a callback which
will be passed the model related to the current row.

#### view (string|callback|object)

The CellView that's gonna be used for rendering the column's cell associated to
the current row.

If not defined, the model's attribute corresponding to `column.property`.

You can pass an [Underscore template](http://underscorejs.org/#template) as a
string, it will be compiled and executed with the `model.toJSON()` as context.

You can also pass a callback function. It will be called with the current row's
model and the return value will be displayed in the cell.

You can finally pass an object to use one of the specific views provided or a
custom view. This object must have a type property which refers to view's type
that gonna be used for the Cell. The other properties are gonna be passed to
the constructor function of the view.

```javascript
{
  title: 'Edit',
  view: {
    type: Backbone.Datagrid.ActionCell,
    label: 'Edit',
    actionClassName: 'btn btn-primary',
    action: function(planet) {
      alert('Would edit ' + planet.get('name') + '!');
      return false;
    }
  }
}
```

Pagination
----------

By default, pagination controls are displayed for a paginated datagrid. But an
API is also available to manually control pagination. Each of the following
functions causes a datagrid rendering:

### Pager

The Pager is an object extending Backbone.Model which manages the state of the
pagination for the datagrid.

#### datagrid.page(page)

Go to the specified page. Delegates to `datagrid.pager.page(page)`.

#### datagrid.perPage(perPage)

Set the number of items displayed per page. Delegates to
`datagrid.pager.perPage(perPage)`.

#### datagrid.pager.next()

Go to the next page.

#### datagrid.pager.prev()

Go to the previous page.

#### datagrid.pager.get('currentPage')

Returns the current page number.

#### datagrid.pager.get('perPage')

Returns the current number of element per page.

#### datagrid.pager.hasPrev()

Tests if the collection has a previous page.

#### datagrid.pager.hasNext()

Tests if the collection has a next page.

#### Pager's events

As Backbone.Model, you can bind [events triggered by any object extending
Backbone.Model](http://backbonejs.org/#FAQ-events) if you want to bind some
behavior when the user interact with the pager. You can for example very easily
save the current pager status in the sessionStorage:

```javascript
datagrid.pager.on('change', function(pager) {
  sessionStorage.setItem('datagrid-current-page', pager.get('currentPage'));
  sessionStorage.setItem('datagrid-per-page', pager.get('perPage'));
});
```

Here is another example which observes changes of the current page only:

```javascript
datagrid.pager.on('change:currentPage', function(pager) {
  // A really convenient alert...
  alert("Hey you are changing page for: " + pager.get('currentPage'));
});
```

### In memory

If the datagrid manages an in memory collection, pagination will be
automatically handled for you by slicing the collection with the right start
and end indexes according to the current page and the number of elements per
page you want to be displayed.

### Server API

When dealing with a server API, there are two things you need to configure in
your collection for pagination to work properly:

* set some properties, generally fetched from the API, that will tell the
  datagrid if a previous, next or specific page is available to display
  relevant pagination controls.
* set a `data` property that will tell the datagrid which request parameters it
  needs to send to the server to the specify the current page and the number of
  items per page you want.

#### Configuring pagination controls

Some of the following properties must be set to the collection:

* `hasPrev` if there is a previous page to enable a control which links to the
  previous page.
* `hasNext` if there is a next page to enable a control which links to the next
  page.
* `totalPages` or `total` the total number of pages or elements to be able to
  display full pagination controls with a link to each of the available pages.

In the case you know from the server API the total number of pages or elements,
you just have to set one of these value for the datagrid to be able to display
full pagination controls.

In the case where this information is not available, the datagrid will only be
able to display controls for previous and next page according to the related
hasNext and hasPrev flags.

You will be able to retrieve these informations from the server API you are
dealing with, so the best place to set these properties to the collection is in
`collection.parse(resp)` which is called by Backbone when fetching from the
server.

For example, if the server API provides the total number of elements by
wrapping the collection:

```javascript
{
  total: 24
  content: [{
    foo: 'bar'
  }, {
    foo: 'foobar'
  }]
}
```

Here is how you could implement your collection's fetch function:

```javascript
parse: function(resp) {
  this.total = resp.total;
  return resp.content;
}
```

* you first need to store the total number of elements in the collection.
* Then you have to return the actual array which gonna be used by Backbone to
  populate the collection. See
  [collection.parse(resp)](http://backbonejs.org/#Collection-parse) for more
  details.

Here is a second example using GitHub's API with JSON-P:

```javascript
parse: function(resp) {
  this.hasNext = false;
  var link = _.find(resp.meta.Link, function(link) {
    if (link[1].rel == 'next') {
      this.hasNext = true;
      return true;
    }
  }, this);
  return resp.data;
}
```

Here we just set an `hasNext` flag based on the meta link informations provided
by GitHub. As the total number of pages is unknown, only next and previous page
will be available as pagination controls.

#### Configuring request parameters

You have to set the data property in your collection. This can be an object or
a function returning an object. This object will be passed as a data option to
Backone's collection.fetch(options) and finally passed as a query string by
jquery to your server API while fetching a new page.

The pager will be passed to the function so that you will be able to get the
currentPage and the number of element perPage wanted to pass them as query
parameters values. Here is an example (in your collection):

```javascript
data: function(pager) {
  return {
    page:     pager.get('currentPage'),
    per_page: pager.get('perPage')
  }
}
```

Here would be the query string resulted from fetching the 4th page with 10
elements per page:

    ?page=4&per_page=10

Here is an alternative example that will produce the same query string but by
directly setting an object:

```javascript
data: {
  page:     function(pager) { return pager.get('currentPage'); },
  per_page: 10
}
```

Here the number of elements per page is definitely fixed (which is generally
not a good idea).

Sorting
-------

Sorted datagrid columns can be sorted by clicking on the column's header cell.
A first click will sort in ascending order, the following clicks will toggle
sorting direction between descending and ascending. You can also control
sorting thanks to the following function.

### Sorter

As for the Pager, the Sorter is an object extending Backbone.Model. Its role is
to manage the sorting state of the datagrid.

#### datagrid.sort(column, [order])

Sort the datagrid by the specified column in the specified order. The column
can be the column's property name or the column's index (beginning at 0). You
can use `Datagrid.Sorter.ASC` and `Datagrid.Sorter.DESC` to specify the
sorting direction.

Delegates to `datagrid.sorter.sort(column, [order])`.

#### sorter.get('column')

Returns the column which is currently sorted identified by (in order of
priority):

* sortBy if defined in the column definition.
* property if defined in the column definition.
* column's index otherwise.

#### sorter.get('order')

Returns the sorting direction, can be `Datagrid.Sorter.ASC` or
`Datagrid.Sorter.DESC`.

#### Sorter's events

In the same way you can bind events triggered by the Pager, you can also bind
[events triggered by the Sorter](http://backbonejs.org/#FAQ-events) (as a
Backbone.Model) and react to sorting state changes.

```javascript
datagrid.sorter.on('change', function(sorter) {
  sessionStorage.setItem('datagrid-sorted-column', sorter.get('column'));
  sessionStorage.setItem('datagrid-sorted-order', sorter.get('order'));
});
```

### In memory

An in memory collection will be sorted using a comparator function that gonna
be passed to Backbone's `collection.sort(options)`.

The comparator function is specific to a sortable column and must be specified
in the column's definition. The functions takes two arguments : model1 and
model2 and should follow the specifications of the compareFunction expected for
[Array.sort](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/sort).

By default the comparator function will be based on
[String.localeCompare](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/localeCompare)
for a sensible alphabetical sorting.

Example of a column definition with a custom comparator function:

```javascript
{
  property: 'rank',
  sortable: true,
  comparator: function(p1, p2) {
    return p1.get('rank') - p2.get('rank');
  }
}
```

### Server API

Configuring how the datagrid will pass sorting parameters to the server API is
done in the same way as we configured pagination: using the collection's data
attribute.

In addition to the pager, the sorter is passed as a second parameter to the
functions which generate request parameters data. All you need to do is to map
the request parameters your API is using for sorting to the current sorting
status provided by the datagrid in the sorter.

Here is an example data function implementation in your collection:

```javascript
data: function(pager, sorter) {
  return {
    per_page:  pager.get('perPage'),
    page:      pager.get('currentPage'),
    sort:      sorter.get('column'),
    direction: sorter.get('order')
  };
}
```

With this configuration, requesting the 4th page with 10 element per page and
sorting by name descendant would produce the following query string:

    ?page=4&per_page=10&sort=name&direction=desc

Status
------

It is for now in its early stage of developments: the API may be subject to
changes.

Contributing
------------

[Grunt](http://gruntjs.com/) is used for managing the development workflow,
here is how you cant get up everything you need to contribute to
backbone.datagrid:

1. Install [Node.js](http://nodejs.org/download/).
2. Install [phantomjs](http://phantomjs.org) for testing from the CLI.
3. Clone the project:
       $ git clone https://github.com/loicfrering/backbone.datagrid.git
4. Install dependencies with npm:
       $ npm install
5. Add `./node_modules/.bin` to your path:
       $ export PATH=$PATH:./node_modules/.bin
6. Use Grunt for:
   * Linting and testing:
         $ grunt test
   * Building:
         $ grunt dist

Changelog
---------

### 0.3.2

* Fix an issue that caused useless Ajax calls.

### 0.3.1

* Datagrid is now responsible for rendering itself.
* Improve GitHub example: an input field allows to enter the username.
* Bug fixes in datagrid's preparation.

### 0.3.0

* Support server API with request based pagination and sorting.
* New example based on GitHub's API which demonstrate server API support.
* Add a tableClassName option.
* Minor bug fixes.

### 0.2.0

* Group Datagrid objects in Backbone.Datagrid namespace.
* Release a dedicated [Backbone.Datagrid](http://loicfrering.github.com/backbone.datagrid/)
  web page with resources and documentation.

### 0.1.0

* Initial backbone.datagrid release.
* Manages in memory collections.

License
-------

Copyright (c) 2012 [Loïc Frering](https://github.com/loicfrering), licensed
under the MIT license. See the LICENSE file for more informations.
