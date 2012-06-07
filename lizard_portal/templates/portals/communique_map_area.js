/**
 * Created by PyCharm.
 * User: bastiaanroos
 * Date: 24-10-11
 * Time: 8:13
 * To change this template use File | Settings | File Templates.
 */

{
    title: 'Gebied',
    height: 200,
    xtype: "mapportlet",
    addDefaultControls: false,
    options: {
        projection: new OpenLayers.Projection("EPSG:900913"),
        units: "m"
    },
    //init_workspace: false,
    autoLoadWorkspaceStore: {
        object_slug: 'minimap-area'
    },
    plugins: [
        'applycontext'
    ],
    onApplyParams: function(params) {
        var me = this;
        if (!this.init_workspace && this.autoLoadWorkspaceStore) {
            this.workspaceStore.load({
                 params: me.autoLoadWorkspaceStore
            });
            this.init_workspace = true
        }

        //iets over zetten van parameter
    },
    extent: new OpenLayers.Bounds.fromArray(Lizard.CM.getContext().init_zoom),
    workspaceStore: Lizard.store.WorkspaceStore.get_or_create('minimap_' + Ext.id())
}
