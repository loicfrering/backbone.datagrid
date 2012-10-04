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
var myCollection = new MyConnlection();
var datagrid = new Datagrid({
  collection: myCollection
});
$('#datagrid').html(datagrid.render().el);
```

Status
------

It is for now in its early stage of development and not yet distributed as a
single, embeddable JavaScript file.

License
-------

Copyright (c) 2012 Loïc Frering, licensed under the MIT license. See the
LICENSE file for more informations.
