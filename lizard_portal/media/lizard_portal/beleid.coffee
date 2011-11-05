

Ext.Loader.setConfig disableCaching: false
Ext.Loader.setPath 'Lizard', '/static_media/lizard_portal/lizard'
Ext.Loader.setPath 'Vss', '/static_media/lizard_portal/vss'
Ext.Loader.setPath 'GeoExt', '/static_media/geoext4/src'


Ext.application 
    name: 'lizardViewer'
    models: [
        'Vss.model.Communique',
        'Vss.model.Esf'
        'Vss.model.ObjectTree'

    ]
    stores: [
        'Vss.store.Communique',
        'Vss.store.Esf'
        'Vss.store.CatchmentTree'
        'Vss.store.KrwGebiedenTree'
    ]

    requires: ['Lizard.portlet.Portlet'
        'Lizard.portlet.PortalPanel'
        'Lizard.portlet.PortalColumn'
        'Lizard.portlet.GridPortlet'
        'Ext.Img',
        'Lizard.plugin.ApplyContext',
        # 'Ext.DomHelper',
        'Ext.grid.*'
        'Ext.data.Model'
        'Ext.data.*'
        'Ext.tree.*'
        'Ext.button.*'
        'Lizard.ux.CheckColumn'
        'Lizard.ux.VBoxScroll'
        'GeoExt.panel.Map'
        'GeoExt.data.LayerStore'
        'GeoExt.data.LayerModel'
        'GeoExt.data.reader.Layer'
        'Ext.MessageBox']



    launch: ->
        # OpenLayers.ImgPath = "http://js.mapbox.com/theme/dark/";
        OpenLayers.ImgPath = "/static_media/themes/dark/";

        settings = {
            lizard_context:
                period_start:'2000-01-01T00:00'
                period_end: '2002-01-01T00:00'
                object: 'krw_waterlichaam'
                object_id: null
                portalTemplate:'krw-overzicht'
                base_url: 'portal/beleid'
                activeOrganisation: [1,2]
            area_selection_template: 'krw_selectie'
            area_store: 'Vss.store.KrwGebiedenTree'
        }



        Ext.create('Lizard.window.Dashboard', settings)
