# Current layers in collage. Based on WorkspaceItemStore
Ext.define('Lizard.store.CollageItemStore', {
    extend: 'GeoExt.data.LayerStore'
    alias: 'store.collageitemstore'

    #storeId: 'WorkspaceStore'

    model: 'Lizard.model.CollageItemModel'

    createWorkspaceItem: (config, index=null) ->
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

            collage_item = Ext.create('Lizard.model.CollageItemModel', config)
            collage_item.set('visibility', true)
            collage_item.set('visible', true)

            if index is not null
                @insert(index, collage_item)
            else
                @add(collage_item)

            return collage_item

    deleteWorkspaceItem: (config) ->
        record = @getById(config.plid)

        if record
            @remove(record)
        else
            console.log('Warning: record already removed')

})
