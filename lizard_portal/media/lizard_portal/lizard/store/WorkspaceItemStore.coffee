# Current layers in workspace. Workspace items.
Ext.define('Lizard.store.WorkspaceItemStore', {
    extend: 'GeoExt.data.LayerStore'
    alias: 'store.workspaceitemstore'

    #storeId: 'WorkspaceStore'

    model: 'Lizard.model.WorkspaceItemModel'

    data: [
        new OpenLayers.Layer.OSM('Openstreetmap')
    ]

    createWorkspaceItem: (config, index=null) ->
        #alert('creating workspace item')
        record = @getById(config.plid)

        if record
            console.log('Warning: record already added')
            return record
        else
            if config.plid
                config.id = config.plid

            workspace_item = Ext.create('Lizard.model.WorkspaceItemModel', config)

            if index is not null
                @insert(index, workspace_item)
            else if index < 0
                @insert(@getCount() + index, workspace_item)
            else
                @add(workspace_item)

            return workspace_item

    deleteWorkspaceItem: (config) ->
        record = @getById(config.plid)

        if record
            @remove(record)
        else
            console.log('Warning: record already removed')

})
