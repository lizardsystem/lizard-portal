Changelog of lizard-portal
==========================


0.10 (unreleased)
-----------------

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
