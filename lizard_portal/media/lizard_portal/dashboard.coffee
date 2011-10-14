Ext.Loader.setConfig disableCaching: false
Ext.Loader.setPath 'Lizard', '/static_media/lizard_portal/lizard'


Ext.application 
    name: 'lizardViewer'
    launch: -> 
        Ext.create 'Lizard.window.Dashboard'
        pw = Ext.getCmp 'portalWindow'
        pw.loadPortal {portalTemplate:'homepage'}
        # ^^^ TODO: Hardcoded to homepage!
        
