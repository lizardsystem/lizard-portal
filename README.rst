lizard-portal
==========================================

Introduction
------------

This is a Django app for management of portlets using Ext.js 4.

Fixtures
--------

Load the initial portalconfiguration data.
This will give you at least the required 'homepage' configuration.

$ bin/django loaddata portalconfiguration


Under the hood
--------------

Pages in lizard-portal make use of ExtJS. The pages make use of a single
django template: portal_pageframe.html

The contents are defined by a javascript file 'extjs_app', such as
lizard_portal/watersysteem.js. In this file you must define
Ext.application({...}).


Application construction
------------------------

Iets met Store.

Iets met grafische elementen.

Hoe worden deze gecombineerd?


JS Libraries
------------

lizard
======

All kinds of grids, panels, plugins, portlet, ux, window.


Portals

A portal consist of visual elements on the screen with actions
attached to it. A portal can be a selection screen with a map, it can
be a form, a tree, or anything.  A portal is defined by a javascript
file containing an object. The contents can be shown in a Dashboard.

The default location is /templates/portals.


Lizard.window.Dashboard
-----------------------
It is a Ext.container.Viewport with the following additions:

- When you enter, the page shows a tree on the left, a 'portal'
  (default: Area Selection map) in the middle, Analyse on the right,
  breadcrumbs on top.
- Stores lizard context: period_start, period_end, object, object_id,
  portalTemplate, base_url.
- Can load another (portal) page as replacement for the selection map
  when selecting an element from the tree or on the map.
- Analysis on the right

After selecting an area there will be a hash (#) with 3 items next to
it:

- portalTemplate (i.e. 'homepage', 'aan_afvoergebied_selectie')
- object: object type, i.e. 'aan_afvoergebied'
- object_id: id in the object type. i.e. '2120' (primary key)
These will be applied.

Settings

- area_selection_template, i.e. aan_afvoergebied_selectie. Points to a
  js file in templates/portals/ subdir.
- area_store, i.e. 'Vss.store.CatchmentTree'
- lizard_context: period_start, period_end, object, object_id,
  portalTemplate, base_url



vss
===

Store, form, grid, model.


Store
-----

Vss.store.CatchmentTree
=======================

A Ext.data.TreeStore with a custom root.
