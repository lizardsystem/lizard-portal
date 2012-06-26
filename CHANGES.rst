Changelog of lizard-portal
==========================


0.61.3 (unreleased)
-------------------

- Bugfix: you can now save workspaces with background (it would crash before).

- Clean up some code, remove some consolelogs.


0.61.2 (2012-06-25)
-------------------

- Updated link to collage screen with current (client-side) date range.


0.61.1 (2012-06-25)
-------------------

- Renamed layer and legend in thememap tempate.


0.61 (2012-06-25)
-----------------

- Renamed theme map in template.


0.60 (2012-06-25)
-----------------

- Make popup work for layers based on vss_area_value layer. Now the
  mapportlet adds the 'styles' request parameter to the getfeatureinfo
  request.

- Change layout of legend and workspace for esf theme map and add extra
  legend for ESF total.


0.59 (2012-06-21)
-----------------

- Added link to collage screen.


0.58.3 (2012-06-21)
-------------------

- Fixed pylint errors.

- Renamed link to upload dbf file in 'Beheer' form.

- Renamed ESF-themakaart.


0.58.2 (2012-06-15)
-------------------

- Fixed grammatical mistake in message.

- Changed permissions to upload wb/esf configuration, allowed only for analyst
  and superuser.


0.58.1 (2012-06-14)
-------------------

- added language file for ext-js (pp 195)


0.58 (2012-06-14)
-----------------

- added userrights to views (pp 367)


0.57.20 (2012-06-11)
--------------------

- Replace old layer names for 'krw-selectie'


0.57.19 (2012-06-07)
--------------------

- Add cql to legend urls for esf popup maps.


0.57.18 (2012-06-07)
--------------------

- Split communique_map template in two, for areas and waterbodies.


0.57.17 (2012-06-05)
--------------------

- Fixed geometry editor polygons not changeable.

- Fixed geometry editor projection problem when in change mode.


0.57.16 (2012-06-05)
--------------------

- Added new x-tool icons: cancel-yellow, delete-red, delete-single,
  edit, zoom-in, zoom-out.

- Added various tooltips.

- Fix link to ESF-overzichts-tabel. renamed, because only capital changes are not correct

- ie issues (partly solve pp346)

- Fix loading signal (pp 136)


0.57.15 (2012-06-04)
--------------------

- Changed measure-status legend in themakaart.


0.57.14 (2012-06-01)
--------------------

- Fix ESF map popup reopen (part pp 307 + 308)


0.57.13 (2012-05-31)
--------------------

- Added functionality to remove rejected configuration on validation.
- Improved logging of celery tasks.


0.57.12 (2012-05-31)
--------------------

- Fixed themakaart EKR legend.


0.57.11 (2012-05-30)
--------------------

- bugfix esf-overzicht-beheer
- changed look and feel esf-overview


0.57.10 (2012-05-30)
--------------------

- Added preparations for themakaart maatregelen.


0.57.9 (2012-05-30)
-------------------

- Themakaart: updated ESF.


0.57.8 (2012-05-30)
-------------------

- added functionality to run 'verwerk zip bestanden met configuraties'
  task on uploading zip-files.
- added functionality to upload zip-files as superuser.

0.57.7 (2012-05-30)
-------------------

- bugfix Communique save  for ie
- bugfix for ESF overview screen
- added scale and scale line (par of pp 247)
- removed area name from header EKR screen


0.57.6 (2012-05-30)
-------------------

- Themakaart: added legend for EKR Doelstelling.

- Esf: Fix 'p op kaart' view.


0.57.5 (2012-05-29)
-------------------

- Bugfix: when closing a popup the background would sometimes stay in
  "loading".


0.57.4 (2012-05-29)
-------------------

- added classes for history display of esf and waterbalance configurations

0.57.3 (2012-05-23)
-------------------

- Added functionality to upload esf/wbconfiguration as zip file.

- Implement history tool for esf-tree.

- Implement history tool for waterbalance configuration.

- Add check to apply context plugin for undefined parent.


0.57.2 (2012-05-21)
-------------------

- Changed and removed fields in waterbalans-configuratie form.


0.57.1 (2012-05-10)
-------------------

- Implement history columns on annotation grid.


0.57 (2012-05-10)
-----------------

- Reenabled some javascript, to fix a lot of broken things.

- Fix annotation history url.

- added personal extents based on areas visible by user (pp 226)

- defined default background map in context (prevent problems with mismatching maps pp 254)

- added feedback of loading layers and map clicks (pp 136)

- only one layer selectable (pp 317)

- changed some names of pages (pp 324)

- splitted Themakaarten page into 2 pages and put EKR table in popup (part of pp 179)

- bug fix in navigation related to area selection on the map (pp 177)

- repeated column area name in steeringparameter overview (pp 333)

- window header name change form ' annotatie' to 'analyse interpretatie'  (pp


0.56 (2012-05-09)
-----------------

- Updated links to serverprocessen (2x).

- Updated tasks to work with lizard-task 0.4.


0.55 (2012-05-09)
-----------------

- Removed fields in 'waterbalans-configuratie' form, issue #105.

- changed layout for analyses screen (pp 253)

- fixed support for IE en Firefox (still some layout issues on IE)

- Makes the configuration diff window scrollable

0.54 (2012-04-27)
-----------------

- Added 'constrainHeader: true' to all popup windows.

- Make geometry editor zoom to geom & active object


0.53 (2012-04-27)
-----------------

- Removes the functionality to view ESF configuration diffs - this
  functionality has been moved to lizard-validation.


0.52 (2012-04-27)
-----------------

- Changed green esf icons to blue.


0.51 (2012-04-26)
-----------------

- Added tooltips for Lizard.screen.linkToPopup tools.

- Added tooltip for "Nieuwe maatregel toevoegen" (2x).

- maatregelen and maatregelen_krw now have wider left ticks and the
  legend on the right side.

- fixed communique (including support for an enter)


0.50 (2012-04-25)
-----------------

- added graph reload after editing steeringparameter graphs (pp 294)

- add analyse interpretation list refresh after add or edit (pp 302, pp 303)

- changed name into 'EKR overzicht' (pp 189)

- communique default not collapsed (pp 321)


0.49 (2012-04-25)
-----------------

- Added feature optional save dialog:
  EditableGrid.msgDeleteSelectedRecord.


0.48 (2012-04-25)
-----------------

- Renamed popup title EditSummaryBox from 'Samenvatting' to
  'Samenvatting wijzigingen'.


0.47.9 (2012-04-24)
-------------------

- Add collapsible to ekr score portlet.


0.47.8 (2012-04-24)
-------------------

- Created 'Informatie KRW-waterlichaam' view, issue #181.


0.47.7 (2012-04-24)
-------------------

- Change alert message.
- Remove debugger statement.
- Add option handling for osm.


0.47.6 (2012-04-23)
-------------------

- Fixed legend-location in maatregel detail screen (the option was
  renamed from legend_location to legend-location).


0.47.5 (2012-04-23)
-------------------

- Added legend_location as parameter for Lizard.model.Graph. Supports
  lizard-graph 0.17.


0.47.4 (2012-04-20)
-------------------

- Add popup classes for measure and annotation.


0.47.3 (2012-04-20)
-------------------

- Updated user info #139.

- Remove console logging from combomultiselect.  - Modify mapwindow
  (That's the geometry editor) to produce only multigeometries,
  but no geometrycollections anymore.
- Make drawing mode on geometry editor show correct value when editing
  existing geometry.


0.47.2 (2012-04-19)
-------------------

- Changed security check on request of 'Koppeling KRW en aan/afvoergebieden' form.

- Fix not being able to reedit linestrings.


0.47.1 (2012-04-18)
-------------------

- Modify annotation overview component layout.


0.47 (2012-04-17)
-----------------

- Removed debugger statement in ContextManager.

- Removed console.log from TableField.

- Removed console.log from MultiGraphStore.

- Removed console.log from Screen.

- Add css class for wide table


0.46 (2012-04-17)
-----------------

- Uses a Django setting to specify the directory to copy the configuration DBFs
  to


0.45 (2012-04-17)
-----------------

- Fix area selection by pointing to correct geoserver layer.


0.44 (2012-04-17)
-----------------

- Added breadcrumbs for "geschikte maatregelen", advies.js.


0.43 (2012-04-17)
-----------------

- Change in context saving when log out and change user.


0.42 (2012-04-16)
-----------------

- Improves the import of water manager configurations to validate: the check
  for the water manager is case-insensitive now
- Shows the log of the latest validation action in the user interface.


0.41 (2012-04-15)
-----------------

- Nothing changed yet.


0.40 (2012-04-13)
-----------------

- Provides a working user interface to the table that contains the
  configurations to validate (nens/vss#102).


0.39 (2012-04-13)
-----------------

- improved saving of context (pp issue 108 en 102)

- bugfix for organization name in user information (pp issue 139)

- Improved analyse-interpretatie-grid

- Add 'add' tool to analyse-interpretatie-grid


0.38 (2012-04-12)
-----------------

- Sets the meta info for each configuration
- Sets the user name for each configuration
- Uses the Dutch translations for configurations to 'Keep' or 'Validate'.


0.37 (2012-04-12)
-----------------

- Fixes several bugs related to the view of the configurations to validate.
- Fixes a bug with the task to prepare the configurations.


0.36 (2012-04-12)
-----------------

- Change the way annotations are displayed.


0.35 (2012-04-12)
-----------------

- Adds functionality to prepare the configurations that are specified by a set
  of zip files for validation (nens/vss#96).


0.34 (2012-04-05)
-----------------

- Fixes the issue that a user with the right credentials could not access the
  screen to manage the coupling of KRW water bodies and catchment areas (Pp
  222).


0.33 (2012-04-04)
-----------------

- Added popup contents for 'Over deze versie' in header.coffee.


0.32 (2012-04-04)
-----------------

- Objects in Lizard.window.MapWindow now return objects in lon/lat
  coordinates, before it was in google coordinates (Pp #142).


0.31 (2012-04-03)
-----------------

- Added icons and style for ESF configuration tree: folder, main,
  calculation, supportive.

- Removed console log.


0.30 (2012-04-02)
-----------------

- Save context when selecting "Andere gebruiker", or "Log uit".

- Created function saveContext in ContextManager and put the save
  context code in it (previously it was only in the window.onunload
  part).

- Added try/except around auto_login. If it fails you are not logged
  in instead of crash.


0.29 (2012-03-29)
-----------------

- Fixed projectplace #104: MultiGraphStore can now handle graphs that
  do not fit in the topbar of the screen.


0.28 (2012-03-29)
-----------------

- Updated the validation backend to support multiple configurations per zip
  file (nens/vss#96).


0.27.1 (2012-03-28)
-------------------

- Switched titles Legenda and EKR in themakaart.


0.27 (2012-03-28)
-----------------

- Tweaked themakaart layout.

- Fixed bug in MultiImagePortlet. Before the portlet crashed invisibly.


0.26 (2012-03-27)
-----------------

- Legends in themakaart work in progress: first working version (but
  with errors).

- Updated ekr view, it now shows actual data per area.

- Added first working table in themakaart.


0.25 (2012-03-21)
-----------------

- Added custom x-tool icons for empty workspace / collage and delete
  workspace item / collage item.

- Added tooltips to workspace and collage portlet tools.


0.24 (2012-03-21)
-----------------

- Bugfix MultiGraphStore that sometimes the resizer tool would appear twice.


0.23 (2012-03-20)
-----------------

- Updates the drop-down menu labeled 'Beheer' (#88).
- Updates:
  - lizard-registration to 0.1.3 (from 0.1)



0.22 (2012-03-20)
-----------------

- Added view for ekr scores (requires lizard-measure 1.11.2 or higher)

- Separated maatregelen graph. The maatregelen view has the graph on
  the upper side and the table on the lower side. The graph now has
  the correct dt_start/dt_end.

- Added space between "details" and "groot" in MultiGraphStore.


0.21 (2012-03-19)
-----------------

- Removed console logs from several coffee files.

- Made graphs bigger in analyse popup.

- Removed console logs.


0.20 (2012-03-19)
-----------------

- First working collage popups with multiple lines in a single graph.

- Added comments to autologin.


0.19 (2012-03-15)
-----------------

- Working on collage items.


0.18 (2012-03-13)
-----------------

- Removed debugging messages.


0.17 (2012-03-13)
-----------------

- Updated collages, still under construction.


0.16 (2012-03-12)
-----------------

- Added popup class views for analysis: FeatureInfo, TimeSeriesGraph.

- Added collages.


0.15 (2012-03-12)
-----------------

- Connects the view of configurations to the backend (#21).


0.14 (2012-03-08)
-----------------

- Implement initial support to view and validate configurations (#21).


0.13 (2012-03-08)
-----------------

- Added first clickable layers in analysis screen. Still experimental.


0.12 (2012-03-06)
-----------------

- Updated AppScreen.

- Add addslashes filter to context in js template.

- Added fields into Bakjes table of wbconfiguration form.


0.11.4 (2012-02-28)
-------------------

- Change layers in krw_selection and area_selection.

- change cancel button in reset for esf and waterbalance configuration

- bugfix in edit summary window

- fix some esf screen bugs


0.11.3 (2012-02-28)
-------------------

- seperate screen for KRW measures

- fixed problems with ESF tree

- area navigation layout fixed

- reload multiGrpah updated to latest contextManager


0.11.2 (2012-02-28)
-------------------

- Fixed bug in views.application crashing on sessioncontextstore.


0.11.1 (2012-02-27)
-------------------

- Added AppsPortlet, AnalysisPortlet js and coffee files.


0.11 (2012-02-27)
-----------------

- bugfix with un-autorized user

- bugfix with date selection

0.10 (2012-02-27)
-----------------

- context manager parameters changed. see new structure of period en location!

- Make area selection work via geoserver feature request.

- Replace krw layer on krw selection page with geoserver layer.

- For feature requests, use layer parameter.

- Made graph store work remote proxy. Improved store change flags and update of graph buttons after reload of store

- portlet gebieden link added

- esf portlet and gebiedenlink portlet implemented in some portals

- new Context manager and implement these in all portals and other files

- extra features in header

- fixed and improved period selection

- some small bug-fixes

- link from multigraphstore to popup window with fullscreen graph

0.9 (2012-02-24)
----------------


- Adds initial support for suitable measures (beta) (#18).
- Replaces area layer on homepage with geoserver layer.
- Updates
  - lizard-area to 0.2.3,
  - lizard-measure to 1.9 (from 1.5.8),
  - nens-graph to 0.7.

- Make area selection work via geoserver feature request.



0.8.4 (2012-02-17)
------------------

- Added first Analysis navigation: AppScreen.

- removed authorization parts from portals (implement this later)

- added Lizard.windiw.EditSummaryBox and implementation in portals

- add sortabel to column settings




0.8.3 (2012-02-13)
------------------

- Nothing changed yet.


0.8.2 (2012-02-13)
------------------

- linkToPopup method also can have a search tool now.

- add read-only row functionality to EditableGrid

- add MultiGraph portal with store

- implement MultiGraph portal with store for a few screens

- fixed week selection in period selection window


0.8.1 (2012-02-09)
------------------

- Add boolean reload parameter to linkToPopup method of portal window,
  for reloading images

- Fix graph not loading for measure page


0.8 (2012-02-07)
----------------

- added last edit information to communique
- editable grids:
  - made pagination optional


- added SO4 fields into bucket, structure tables of wbconfiguration.

- replaced dependency vss.utils to lizard_registration.utils.

- Pinned:
  lizard-registration 0.1


0.7 (2012-01-31)
----------------

- improved navigation (breadcrumb)
- improved form and grid functions


0.6 (2012-01-25)
----------------

- Fixed permissions check in template.
- remember login and autologin
- improved form and editable grid functions
- minor bug fixing
- added links to forms in 'beheer' screen


0.5 (2011-12-13)
----------------

- Nothing changed yet.


0.4 (2011-12-09)
----------------

- a lot of other things, see dif

- first draft version of analyse window

- homepage link under logo

Bugfixes:
- Other method for portal loading, which is also supported by other browsers
- Period Picker


0.3 (2011-12-07)
----------------

- Some merges.

- Added drop down list in_out to structures grid.

- Added columns for wbconfiguration tables.

- Removed hardcoded localhost reference. Made it relative to the root instead.


0.2 (2011-11-07)
----------------

- First functioning areas homepage and esf screen.


0.1 (2011-10-19)
----------------

- Initial library skeleton created by nensskel.  [your name]
