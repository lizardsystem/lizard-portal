/**
 * Created by PyCharm.
 * User: bastiaanroos
 * Date: 18-10-11
 * Time: 15:33
 * To change this template use File | Settings | File Templates.
 */
{% load get_portal_template %}

{
    itemId: 'themakaart-esf',
    title: 'Themakaart ESF',
    breadcrumbs: [
        {
            name: 'themakaart ESF'
        }
    ],
	xtype: 'portalpanel',
	items: [{
		width: 300,
		items: [
        {
            title: 'Legenda',
            height: 150,
            xtype: 'multiimageportlet',
            collapsible: true,
            //collapsed: true,
            store: Ext.create('Lizard.store.Graph',{
            //store: Ext.create('Ext.data.Store',{
                data: [{
                    name: 'ESF status',
                    base_url: '/layers/wms/?FORMAT=image%2Fpng&TRANSPARENT=TRUE&STYLE=vss_esf&CQL_FILTER=name%20%3D%20\'ESF-STATUS\'&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&SRS=EPSG%3A900913&BBOX=460467.38252035,6800747.0720688,640132.61747965,6894993.9279312&LAYER=vss:vss_area_value&width=150&height=20'
                }]
            }),
            flex: 1

        },{
            xtype: 'workspaceportlet',
            workspaceStore: Lizard.store.WorkspaceStore.get_or_create('themakaart-esf'),
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
                object_slug: 'thema_kaart_esf'
            },
            init_workspace: false,
            controls: [new OpenLayers.Control.LayerSwitcher()
            ],
            workspaceStore: Lizard.store.WorkspaceStore.get_or_create('themakaart-esf'),
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
