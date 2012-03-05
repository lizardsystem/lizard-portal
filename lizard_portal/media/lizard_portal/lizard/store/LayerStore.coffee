# Current layers in workspace
Ext.define('Lizard.store.LayerStore', {
    extend: 'GeoExt.data.LayerStore'
    alias: 'store.layerstore'

    #storeId: 'WorkspaceStore'

    model: 'Lizard.model.LayerModel'

    data: [
        new OpenLayers.Layer.OSM('Openstreetmap')
    ]
})
