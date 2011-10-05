Ext.Loader.setConfig({disableCaching: false});
Ext.Loader.setPath('Lizard', '/static_media/lizard_portal/lizard');

Ext.application({
    name: 'lizardViewer',
    launch: function() {

        /*Ext.require([
            'Ext.layout.container.*',
            'Ext.resizer.Splitter',
            'Ext.fx.target.Element',
            'Ext.fx.target.Component',
            'Ext.window.Window',
            'Lizard.Portlet.Portlet',
            'Lizard.Portlet.PortalColumn',
            'Lizard.Portlet.PortalPanel',
            'Lizard.Portlet.PortalDropZone',
            'Lizard.Portlet.GridPortlet',
            'Lizard.Portlet.ChartPortlet'
        ]);*/
        
        


        Ext.create('Lizard.Window.Dashboard');
    }
});