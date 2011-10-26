Ext.Loader.setConfig disableCaching: false
Ext.Loader.setPath 'Lizard', '/static_media/lizard_portal/lizard'
Ext.Loader.setPath 'Vss', '/static_media/lizard_portal/vss'
Ext.Loader.setPath 'GeoExt', '/static_media/geoext4/src'


Ext.application 
    name: 'lizardViewer'
    models: [
        'Vss.model.Communique',
        'Vss.model.Esf'
        'Vss.model.Maplayer'
        'Vss.model.ObjectTree'

    ]
    stores: [
        'Vss.store.Communique',
        'Vss.store.Esf'
        'Vss.store.Maplayer'
        'Vss.store.CatchmentTree'
        'Vss.store.KrwGebiedenTree'
    ]

    requires: ['Lizard.portlet.Portlet'
        'Lizard.portlet.PortalPanel'
        'Lizard.portlet.PortalColumn'
        'Lizard.portlet.GridPortlet'
        'Ext.Img',
        # 'Ext.DomHelper',
        'Ext.grid.*'
        'Ext.data.Model'
        'Ext.data.*'
        'Ext.tree.*'
        'Ext.button.*'
        'Lizard.ux.CheckColumn'
        'GeoExt.panel.Map'
        'GeoExt.data.LayerStore'
        'GeoExt.data.LayerModel'
        'GeoExt.data.reader.Layer'
        'Ext.MessageBox']



    launch: ->
        Ext.create 'Lizard.window.Dashboard'        
