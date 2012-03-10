# Current layers in workspace. Workspace items.
Ext.define('Lizard.store.WorkspaceItemStore', {
    extend: 'GeoExt.data.LayerStore'
    alias: 'store.workspaceitemstore'

    #storeId: 'WorkspaceStore'

    model: 'Lizard.model.WorkspaceItemModel'

    data: [
        new OpenLayers.Layer.OSM('Openstreetmap')
    ]

    createWorkspaceItem: (config) ->
        #alert('creating workspace item')
        record = @getById(config.plid)

        if record
            console.log('Warning: record already added')
        else
            config.id = config.plid
            config.clickable = true
            config.visible = true

            workspace_item = Ext.create('Lizard.model.WorkspaceItemModel', config)
            workspace_item.set('visibility', true)
            workspace_item.set('visible', true)

            @add(workspace_item)

    #     # @layerStore.create({ollayer_class: 'OpenLayers.Layer.OSM', name: 'just added'})

    #     # TODO: plant some listener
    #     # @data.new OpenLayers.Layer.OSM('Openstreetmap')

    deleteWorkspaceItem: (config) ->
        record = @getById(config.plid)

        if record
            @remove(record)
        else
            console.log('Warning: record already removed')

})
