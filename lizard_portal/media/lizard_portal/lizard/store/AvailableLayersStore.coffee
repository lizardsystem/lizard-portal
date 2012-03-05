# Does not work yet.. see AvailableLayersPortlet
Ext.define('Lizard.store.AvailableLayersStore', {
    extend: 'Ext.data.TreeStore'
    # extend: 'GeoExt.data.LayerStore'
    alias: 'store.availablelayersstore'

    #storeId: 'WorkspaceStore'

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

    root: {
        text: 'Title'
        expanded: true,
        id: 'root-id'
    }
    autoLoad: true
    proxy: {
        type: 'ajax'
        url: '/workspace/api/layer_view/'
        reader: {
            type: 'json'
            root: 'data'
        }
    }
    fields: ['id', 'text']

})
