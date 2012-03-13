# Current layers in collage. Based on WorkspaceItemStore. Experimental.
Ext.define('Lizard.store.CollageItemStore', {
    extend: 'GeoExt.data.LayerStore'
    alias: 'store.collageitemstore'

    storeId: 'CollageStore'  # There is only one globally

    model: 'Lizard.model.CollageItemModel'

    # Fake collage items.
    # data: [
    #     new OpenLayers.Layer.OSM('Openstreetmap')
    # ]

    createCollageItem: (config, index=null) ->
        # How can I get a 'plid' ? It is auto generated and unique for
        # each possible collage item.
        collage_item = @getById(config.plid)

        if collage_item
            console.log('Warning: collage_item already added')
            return collage_item
        else
            if config.plid
                config.id = config.plid
            #todo add clickable layer option
            config.clickable = true
            config.visible = true

            collage_item = Ext.create('Lizard.model.CollageItemModel', config)
            collage_item.set('visibility', true)
            collage_item.set('visible', true)
            #collage_item.set('identifier', 'id="3201"')

            if index is not null
                @insert(index, collage_item)
            else
                @add(collage_item)

            return collage_item

    deleteCollageItem: (config) ->
        record = @getById(config.plid)

        if record
            @remove(record)
        else
            console.log('Warning: collage_item already removed')

})
