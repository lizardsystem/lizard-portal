/**
 * Created by PyCharm.
 * User: bastiaanroos
 * Date: 18-10-11
 * Time: 15:33
 * To change this template use File | Settings | File Templates.
 */
{% load get_portal_template %}

{
    itemId: 'themakaart-ekr',
    title: 'Themakaart EKR',
    breadcrumbs: [
        {
            name: 'themakaart EKR'
        }
    ],
	xtype: 'portalpanel',
	items: [{
		width: 300,
		items: [
        {
            text: 'EKR score tabel',
            margin: 5,
            xtype: 'button',
            handler: function() {
                var form_window = Ext.create('Ext.window.Window', {
                    title: 'EKR scores',
                    width: 800,
                    height: 600,
                    autoScroll: true,
                    constrainHeader: true,
                    loader:{
                        autoLoad: true,
                        renderer: 'html',
                        url:'/layers/value/',
                        method: 'GET'
                    }
                }).show()
            }

            //html: 'Wordt ingevuld zodra de gegevens beschikbaar zijn'
		},{
            title: 'Legenda',
            flex: 1,
            autoScroll: true,
            xtype: 'multiimageportlet',
            collapsible: true,
            //collapsed: true,
            store: Ext.create('Lizard.store.Graph',{
            //store: Ext.create('Ext.data.Store',{
                data: [{
                    name: 'EKR minst gunstig',
                    base_url: '/layers/wms/?FORMAT=image%2Fpng&TRANSPARENT=TRUE&STYLE=vss_ekr_value&CQL_FILTER=name%20%3D%20\'EKR-ONGUNSTIG\'&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&SRS=EPSG%3A900913&BBOX=460467.38252035,6800747.0720688,640132.61747965,6894993.9279312&LAYER=vss:vss_area_value&width=100&height=30'
                },
                {
                    name: 'EKR Doelstelling',
                    base_url: 'http://localhost:8000/layers/wms/?FORMAT=image%2Fpng&TRANSPARENT=TRUE&STYLE=vss_ekr_score&CQL_FILTER=name%20%3D%20\'EKR-DOELSCORE\'&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&SRS=EPSG%3A900913&BBOX=460467.38252035,6800747.0720688,640132.61747965,6894993.9279312&LAYER=vss:vss_area_value&width=100&height=30'
                }]
            })
        },{
            xtype: 'workspaceportlet',
            workspaceStore: Lizard.store.WorkspaceStore.get_or_create('themakaart-ekr'),
            collapsible: true,
            collapsed: true,
            tools:[],
            height: 150
        }]
	},{
		flex: 1,
		items: [{
			title: 'themakaart',
            flex:1,
            xtype: "mapportlet",
            initZoomOnRender: false,
            autoLoadWorkspaceStore: {
                object_slug: 'thema_kaart_ekr'
            },
            init_workspace: false,
            controls: [new OpenLayers.Control.LayerSwitcher()
            ],
            workspaceStore: Lizard.store.WorkspaceStore.get_or_create('themakaart-ekr'),
            onApplyParams: function(params) {
                var me = this;

                if (!this.init_workspace && this.autoLoadWorkspaceStore) {
                    this.workspaceStore.load({
                        params: me.autoLoadWorkspaceStore
                    });
                    this.init_workspace = true
                }

                me.map.zoomToExtent(new OpenLayers.Bounds.fromArray(Lizard.CM.getContext().init_zoom));

            }
		}]
	}]
}
