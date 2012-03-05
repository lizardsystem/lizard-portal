
# New and experimental. Not sure if this works... Bastiaan?
Ext.define('Lizard.store.LayerStore', {
    extend: 'GeoExt.data.LayerStore'
    alias: 'store.layerstore'

    #storeId: 'WorkspaceStore'

    model: 'Lizard.model.LayerModel'

    data: [
        new OpenLayers.Layer.OSM('Openstreetmap')
    ]
})



