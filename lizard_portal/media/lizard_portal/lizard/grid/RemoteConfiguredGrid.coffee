Ext.define('Lizard.grid.RemoteConfiguredGrid', {
    extend: 'Ext.grid.Panel'
    alias: 'widget.remoteconfiggrid'
    config: {
        configUrl: ''
        configParams: {}
        dataConfig: []
    }
    constructor: () ->
        @initConfig(arguments)
        @callParent(arguments)

    getColumnConfig: () ->
        cols = []
        for col in @dataConfig

            cols.push({
                text: col.title
                width: col.width || 100
                sortable: true
                dataIndex: col.name
                field: {
                    allowBlank: false
                }
            })

        return cols

    initComponent: () ->
        me = @
        me.columns = @getColumnConfig()
        me.store = {
            fields: [
                {
                    name: 'a'
                    mapping: 'a'
                    type: 'auto'
                }
                {
                    name: 'b'
                    type: 'auto'
                }
            ]
            proxy: {
                type: 'ajax'
                url: '/portal/wbbuckets.json'
                extraParams: {
                   _accept: 'application/json'
                }
                reader: {
                    type: 'json'
                }
                autoLoad: true
            }
        }
        @callParent(arguments)
    
})
