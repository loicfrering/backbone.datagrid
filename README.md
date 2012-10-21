Backbone.Datagrid
=================

Backbone.Datagrid is a powerful component, based on Backbone.View, that
displays your Bakbone collections in a dynamic datagrid table. It is highly
customizable and configurable with sane defaults.

Usage
-----

Create a new Datagrid with your collection and options, render it and attach
the resulting element to your document:

```javascript
var myCollection = new MyCollection();
var datagrid = new Datagrid({
  collection: myCollection
});
$('#datagrid').html(datagrid.render().el);
```

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

    * TemplateCell

      * UnderscoreTemplateCell
      * HandlebarsTemplateCell

Datagrid options
----------------

### collection

The Backbone.Collection that is gonna be managed by the datagrid.

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

#### cellClassName (string|callback)

The class name of the cell (td or th). It can be a string or a callback which
will be passed the model related to the current row.

Status
------

It is for now in its early stage of development and not yet distributed as a
single, embeddable JavaScript file.

License
-------

Copyright (c) 2012 Loïc Frering, licensed under the MIT license. See the
LICENSE file for more informations.
