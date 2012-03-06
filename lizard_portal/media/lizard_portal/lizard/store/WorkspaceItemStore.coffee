# Current layers in workspace. Workspace items.
Ext.define('Lizard.store.WorkspaceItemStore', {
    extend: 'GeoExt.data.LayerStore'
    alias: 'store.workspaceitemstore'

    #storeId: 'WorkspaceStore'

    model: 'Lizard.model.WorkspaceItemModel'

    data: [
        new OpenLayers.Layer.OSM('Openstreetmap')
        new OpenLayers.Layer.OSM('Openstreetmap')
    ]
})
