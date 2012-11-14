Backbone.Datagrid
=================

[Backbone.Datagrid](http://loicfrering.github.com/backbone.datagrid/) is a
powerful component, based on Backbone.View, that displays your Bakbone
collections in a dynamic datagrid table. It is highly customizable and
configurable with sane defaults.

[![Build Status](https://secure.travis-ci.org/loicfrering/backbone.datagrid.png)](http://travis-ci.org/loicfrering/backbone.datagrid)

Download
--------

The raw sources can be navigated on [GitHub](https://github.com/loicfrering/backbone.datagrid).
The distributed sources can be found in the `dist/` directory or can be
downloaded directly via one of the following links:

* Production minified version: [backbone.datagrid.min.js (v0.2.0)](https://raw.github.com/loicfrering/backbone.datagrid/v0.2.0/dist/backbone.datagrid.min.js).
* Development version: [backbone.datagrid.js (v0.2.0)](https://raw.github.com/loicfrering/backbone.datagrid/v0.2.0/dist/backbone.datagrid.js).

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
$('#datagrid').html(datagrid.render().el);
```

### Examples

Examples are available in the [examples](https://github.com/loicfrering/backbone.datagrid/tree/master/examples)
directory in the repository.

* Solar: a simple and complete example with an in memory collection of planets from the
  Solar System.
  * [Live version](http://loicfrering.github.com/backbone.datagrid/examples/solar/)
  * [Sources](https://github.com/loicfrering/backbone.datagrid/tree/master/examples/solar)

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
the constructor as data source. The Datagrid view takes care of creating the
`table` HTML element and each of the components described below.

Event bindings:

* collection#reset will cause a rendering of the whole datagrid.

### Header

A Backbone.View for the datagrid's header which gonna render the `thead` HTML
element. It is also responsible for creating a Cell for each column's header.

### Row

A Backbone.View for each row of the datagrid. The Row is responsible for
rendering a row in the table, that is to say a `tr` HTML element, and for
creating a Cell for each column of the datagrid. The Row uses an entry of the
collection: a model.

Events bindings:

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

Datagrid options
----------------

### collection

The Backbone.Collection that is gonna be managed by the datagrid.

### inMemory

If the collection should be manipulated in memory for pagination and sorting.
Otherwise use REST requests.

### paginated

If the datagrid should be paginated or not.

### className

The class attribute for the generated `table`.

### rowClassName

The class attribute for each datagrid's row: `tr` tags. Can be a simple string
with classes separated by spaces or a computed string by passing a callback
function. The callback function will be called with the model associated to the
current row.

### columns

The columns definitions, see the dedicated section below.

Columns definitions
-------------------

You can customize the datagrid using columns definition. It is an array of
definitions, one for each column you want to see in the datagrid. If no
definition is passed to the datagrid, a default column definition is gonna be
created for you for each property of the model managed by the collection you
passed to the datagrid.

A column definition can be a string or an object. If a string is passed, a
default column definition will be generated with the specified string used as
the column's property property (no there's no typo here).

### Default column definition

### Column definition

#### property (string)

The model's property that gonna be displayed in the column. Can be omitted if
the column describe a combination of different properties of the model.

#### title (string)

The title of the column which will be displayed in the table header.

#### sortable (boolean)

If the column is sortable or not.

#### comparator (function)

If the column is sortable, a comparator function that gonna be used to sort the
datagrid by the column. See the dedicated sorting section below for more
informations.

#### cellClassName (string|callback)

The class name of the cell (td or th). It can be a string or a callback which
will be passed the model related to the current row.

Pagination
----------

By default, pagination controls are displayed for a paginated datagrid. But an
API is also available to manually control pagination. Each of the following
functions cause a datagrid rendering.

### datagrid.page(page)

Go to the specified page.

### datagrid.perPage(perPage)

Set the number of items displayed per page.

### datagrid.pager.next()

Go to the next page.

### datagrid.pager.prev()

Go to the previous page.

Sorting
-------

Sorted datagrid columns can be sorted by clicking on the column's header cell.
A first click will sort in ascending order, the following clicks will toggle
sorting direction between descending and ascending. You can also control
sorting thanks to the following function.

### datagrid.sort(column, [order])

Sort the datagrid by the specified column in the specified order. The column
can be the column's property name or the column's index (beginning at 0). You
can use `Datagrid.Sorter.ASC` and `Datagrid.Sorter.DESC` to specifiy the
sorting direction.

### comparator

The comparator function is specific to a sortable column and must be specified
in the column's definition. The functions takes two arguments : model1 and
model2 and should follow the specifications of the compareFunction expected for
[Array.sort](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/sort).

By default the comparator function will be based on
[String.localeCompare](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/localeCompare)
for a sensible alphabetical sorting.

Status
------

It is for now in its early stage of developments: the API may be subject to
changes. Also it only manages in memory collections but REST API should be
supported very soon.

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
5. Use Grunt for:
   * Linting and testing:
         $ grunt test
   * Building:
         $ grunt dist

Changelog
---------

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
