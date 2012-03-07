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

    createWorkspaceItem: () ->
        #debugger
        #alert('creating workspace item')

        # Waarom werkt dit niet?
        workspace_item = Ext.create('Lizard.model.WorkspaceItemModel', {
            ollayer_class: 'OpenLayers.Layer.OSM', name: 'just added', id: 5, order: 100,
            clickable: true})
        # workspace_item = Ext.create(@layerStore.model, {
        #     ollayer_class: 'OpenLayers.Layer.OSM', name: 'just added', id: 5, layer: 4, order: 100,
        #     clickable: true})
        @add(workspace_item)

    #     # @layerStore.create({ollayer_class: 'OpenLayers.Layer.OSM', name: 'just added'})

    #     # TODO: plant some listener
    #     # @data.new OpenLayers.Layer.OSM('Openstreetmap')

    deleteWorkspaceItem: () ->
        alert('deleting workspace item')
})
