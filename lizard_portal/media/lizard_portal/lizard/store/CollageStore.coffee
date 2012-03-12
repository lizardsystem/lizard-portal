# All collages: experimental
Ext.define('Lizard.store.CollageStore', {
    extend: 'Ext.data.Store'
    alias: 'store.collagestore'
    model: 'Lizard.model.CollageModel'
    autoLoad: false

    workspaceItemStore: null


    statics:
        active_stores: {}

        remove: (store) ->
            if @active_stores[store.storeId]
                delete @active_stores[store.storeId]

        get_or_create: (storeId, config={}) ->
            if not @active_stores[storeId]
                config.storeId = storeId
                config.collageItemStore = Ext.create('Lizard.store.CollageItemStore', {})
                @active_stores[storeId] = Ext.create('Lizard.store.CollageStore', config)

            return @active_stores[storeId]


    listeners:
        load:
            fn:(store, records) ->
                me = store
                #arguments
                #debugger

                if records
                    #index = me.collageItemStore.find('is_base_layer', true)
                    #old_background = me.workspaceItemStore.getAt(index)

                    if me.collageItemStore
                        me.collageItemStore.loadData(records[0].get('layers'))

                    # background_index = me.workspaceItemStore.find('is_base_layer', true)
                    # if background_index < 0
                    # #add background from personal preferences or the previous backgroundlayer
                    #     background_pref = Lizard.CM.getContext().background_layer
                    #     if background_pref
                    #         me.workspaceItemStore.insert(0, background_pref)
                    #     else
                    #         me.workspaceItemStore.insert(0, old_background)


})
