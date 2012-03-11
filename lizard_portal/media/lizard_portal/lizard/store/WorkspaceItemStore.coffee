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
            #todo add clickable layer option
            config.clickable = true
            config.visible = true

            workspace_item = Ext.create('Lizard.model.WorkspaceItemModel', config)
            workspace_item.set('visibility', true)
            workspace_item.set('visible', true)

            if index is not null
                @insert(index, workspace_item)
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
