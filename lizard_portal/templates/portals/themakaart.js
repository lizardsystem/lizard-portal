/**
 * Created by PyCharm.
 * User: bastiaanroos
 * Date: 18-10-11
 * Time: 15:33
 * To change this template use File | Settings | File Templates.
 */
{% load get_portal_template %}

{
    itemId: 'themakaart',
    title: 'Themakaart',
    breadcrumbs: [
        {
            name: 'themakaart'
        }
    ],
	xtype: 'portalpanel',
	items: [{
		width: 300,
		items: [
        {
            title: 'Themakaart',
            height: 300,
            layout: {
                type: 'table',
                columns:1
            },
            defaults:{
                width:160,
                xtype:'button',
                margin: 3
            },
            items: [{
                xtype: 'button',
                text: 'Themakaart EKR',
                handler: function() {
                    var store = Lizard.store.WorkspaceStore.get_or_create('themakaart');
                    store.load({
                         params: {
                             object_slug: 'thema_kaart_ekr'
                         }
                    })
                }
            },{
                xtype: 'button',
                text: 'Themakaart ESF',
                handler: function() {
                    var store = Lizard.store.WorkspaceStore.get_or_create('themakaart');
                    store.load({
                        params: {
                            object_slug: 'thema_kaart_esf'
                        }
                    })
                }

            }]

        },{
            title: 'Legenda',
            flex: 1,
            xtype: 'multiimageportlet',
            store: Ext.create('Lizard.store.Graph',{
                //context_ready: true,
                // /layers/wms/?FORMAT=image%2Fpng&TRANSPARENT=TRUE&STYLES=vss_ekr_value&CQL_FILTER=name%20%3D%20'EKR-ONGUNSTIG'&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&SRS=EPSG%3A900913&BBOX=460467.38252035,6800747.0720688,640132.61747965,6894993.9279312&WIDTH=150&HEIGHT=33&LAYER=vss:aan_afvoergebieden
                data: [{
                    id:1,
                    name: 'Legenda aan-afvoergebieden',
                    visible: 'true',
                    base_url: '/layers/wms/?FORMAT=image%2Fpng&TRANSPARENT=TRUE&STYLES=vss_ekr_value&CQL_FILTER=name%20%3D%20\'EKR-ONGUNSTIG\'&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&SRS=EPSG%3A900913&BBOX=460467.38252035,6800747.0720688,640132.61747965,6894993.9279312&LAYER=vss:aan_afvoergebieden&width=150&height=20',
                    use_context_location: false,
                    // width: 150,
                    // height: 500,
                    extra_params: {},
                    has_reset_period: false,
                    reset_period: false,
                    has_cumulative_period: false,
                    cumulative_period: false,
                    extra_ts: null
                },{
                    id:2,
                    name: 'Fews locaties',
                    visible: 'true',
                    base_url: '/layers/wms/?FORMAT=image%2Fpng&TRANSPARENT=TRUE&STYLES=vss_ekr_value&CQL_FILTER=name%20%3D%20\'EKR-ONGUNSTIG\'&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&SRS=EPSG%3A900913&BBOX=460467.38252035,6800747.0720688,640132.61747965,6894993.9279312&LAYER=vss:vss_fews_locations&width=150&height=20',
                    use_context_location: false,
                    // width: 150,
                    // height: 500,
                    extra_params: {},
                    has_reset_period: false,
                    reset_period: false,
                    has_cumulative_period: false,
                    cumulative_period: false,
                    extra_ts: null
                }]
            })
        },{
            xtype: 'workspaceportlet',
            workspaceStore: Lizard.store.WorkspaceStore.get_or_create('themakaart'),
            tools:[]
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
            workspaceStore: Lizard.store.WorkspaceStore.get_or_create('themakaart'),
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
