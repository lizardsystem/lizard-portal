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


Application
-----------

The main building block is lizard_portal.views.site. Provide an
application_name and an active_tab_name in your
urls.py. 'application/<application_name>.js' will then be loaded on
that url.


    url(r'^$',
         'lizard_portal.views.site',
        {'application_name': 'vss',
         'active_tab_name': 'watersysteem/'},
        name="portalpage"),

Define Ext.application in your application. You can use ExtJS here to
build your gui. It is also possible to include external portal
templates.

    {% load get_portal_template %}

    ...
    {% get_portal_template watersysteem_layers %}


Portal templates
----------------

A portal template is a piece of content. For example a buttonbar or a table.

Portal templates are stored in templates/portals/*, TOGETHER WITH
PortalConfiguration objects. Whenever you try to load a portal
template, it will look for it in the templates directory and in
PortalConfiguration objects (the slug must match).

Note: Django searches all template directories. You can add your own
templates/portals directory in your app and those portals will also be
found.


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
- Stores lizard context: period: {start, end, selection}, object {id, name, type},
  portal_template, base_url.
- Can load another (portal) page as replacement for the selection map
  when selecting an element from the tree or on the map.
- Analysis on the right

After selecting an area there will be a hash (#) with 3 items next to
it:

- portal_template (i.e. 'homepage', 'aan_afvoergebied_selectie')
- object: object type, i.e. 'aan_afvoergebied'
- object.id: id in the object type. i.e. '2120' (primary key)
These will be applied.

Settings

- area_selection_template, i.e. aan_afvoergebied_selectie. Points to a
  js file in templates/portals/ subdir.
- area_store, i.e. 'Vss.store.CatchmentTree'
- lizard_context: period: {start, end, selection}, object {id, name, type},
  portal_template, base_url.



vss
===

Store, form, grid, model.


Store
-----

Vss.store.CatchmentTree
=======================

A Ext.data.TreeStore with a custom root.
