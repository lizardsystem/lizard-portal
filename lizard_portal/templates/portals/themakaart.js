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

        },
        {
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
