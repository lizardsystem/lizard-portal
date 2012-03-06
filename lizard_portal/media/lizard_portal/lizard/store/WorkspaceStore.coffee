# All workspaces
Ext.define('Lizard.store.WorkspaceStore', {
    extend: 'Ext.data.Store'
    alias: 'store.workspacestore'
    model: 'Lizard.model.WorkspaceModel'
    autoLoad: false

    layerStore: null

    createWorkspaceItem: () ->
        debugger
        alert('creating workspace item')

        # Waarom werkt dit niet?
        # workspace_item = Ext.create(@layerStore.model, {
        #     ollayer_class: 'OpenLayers.Layer.OSM', name: 'just added', id: 5, layer: 4, order: 100,
        #     clickable: true})
        # @layerStore.add(workspace_item)

        # @layerStore.create({ollayer_class: 'OpenLayers.Layer.OSM', name: 'just added'})

        # TODO: plant some listener
        # @data.new OpenLayers.Layer.OSM('Openstreetmap')

    deleteWorkspaceItem: () ->
        alert('deleting workspace item')

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
