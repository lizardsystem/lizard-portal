# Does not work yet.. see AvailableLayersPortlet
Ext.define('Lizard.store.AvailableLayersStore', {
    extend: 'Ext.data.TreeStore'
    # extend: 'GeoExt.data.LayerStore'
    alias: 'store.availablelayersstore'
    #model: 'Lizard.model.AvailableLayersModel'
    rootVisible: false,
    #storeId: 'WorkspaceStore'
    #indexOf: Ext.emptyFn,

    # autoLoad: true
    # data: {
    #     root: {
    #         expanded: true,
    #         children: [
    #             { text: "detention", leaf: true, checked: false },
    #             { text: "homework", expanded: true, children: [
    #                 { text: "book report", leaf: true, checked: false },
    #                 { text: "alegrbra", leaf: true, checked: false }
    #             ] },
    #             { text: "buy lottery tickets", leaf: true, checked: false }
    #         ]
    #     }
    # }

    
    autoLoad: false
    proxy: {
        type: 'ajax'
        url: '/workspace/api/app_layer_tree/'
        reader: {
            type: 'json'
            #root: 'data'
        }
    }


})
