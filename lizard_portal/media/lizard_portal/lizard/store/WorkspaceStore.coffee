# New and experimental. Not sure if this works... Bastiaan?
Ext.define('Lizard.store.WorkspaceStore', {
    extend: 'Ext.data.Store'
    alias: 'store.workspacestore'
    model: 'Lizard.model.WorkspaceModel'
    autoLoad: false
    layerStore: null



#    data: [
#        new OpenLayers.Layer.OSM('Openstreetmap'),
#        new OpenLayers.Layer.WMS('Aan-afvoergebieden', 'http://maps.waterschapservices.nl/inspire/wms?namespace=inspire',{
#                layers:['inspire:HY.PhysicalWaters.Catchments'],
#                transparent: "true",
#                format: "image/png"
#            },{
#                singleTile: false,
#                displayOutsideMaxExtent: true,
#                projection: new OpenLayers.Projection("EPSG:900913"),
#                visibility: false
#
#            }
#        )
#    ],
})
# Ext.create(Lizard.store.WorkspaceStore)
