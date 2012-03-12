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
            html:'themakaart selectie'
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
                id: 1
            },
            init_workspace: false,
            controls: [new OpenLayers.Control.LayerSwitcher()
            ],
            workspaceStore: Lizard.store.WorkspaceStore.get_or_create('themakaart'),
            onApplyParams: function(params) {
                var me = this;

                if (!this.init_workspace && this.autoLoadWorkspaceStore) {
                    this.workspaceStore.load({
                         params: this.autoLoadWorkspaceStore,
                         callback: function(records) {

                             if (records.length > 0) {
                                 me.workspaceStore.workspaceItemStore.loadData(records[0].get('layers'))
                             }
                         }
                    });
                    this.init_workspace = true
                }

                me.map.zoomToExtent(new OpenLayers.Bounds.fromArray(Lizard.CM.getContext().init_zoom));

            }
		}]
	}]
}
