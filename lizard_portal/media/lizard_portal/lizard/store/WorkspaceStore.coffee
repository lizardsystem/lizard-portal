# All workspaces
Ext.define('Lizard.store.WorkspaceStore', {
    extend: 'Ext.data.Store'
    alias: 'store.workspacestore'
    model: 'Lizard.model.WorkspaceModel'
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
                config.workspaceItemStore = Ext.create('Lizard.store.WorkspaceItemStore', {})
                @active_stores[storeId] = Ext.create('Lizard.store.WorkspaceStore', config)

            return @active_stores[storeId]


})

