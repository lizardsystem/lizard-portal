Ext.define('Lizard.grid.EditableGrid', {
    extend: 'Ext.grid.Panel'
    alias: 'widget.leditgrid'
    config: {
        proxyUrl: '/portal/wbbuckets.json'
        proxyParams: {}
        dataConfig: []
        useSaveBar: true
        enterEditSummary:true
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
                visible: col.visible
                dataIndex: col.name
                field: {
                    allowBlank: false
                }
            })

        return cols


    save: () ->
        @store.sync()

    cancel: () ->
        @store.rejectChanges()

    

    getStoreConfig: () ->
        fields = []
        for field in @dataConfig

            fields.push({
                name: field.name
                type: field.type || 'auto'
                mapping: field.mapping || field.name
            })

        store = {
            fields: fields
            proxy: {
                type: 'ajax'
                url: @getProxyUrl()
                extraParams: {
                   _accept: 'application/json'
                }
                reader: {
                    type: 'json'
                }
                writer: {
                    type: 'json',
                    writeAllFields: false,
                    root: 'data',
                    encode: true,
                    successProperty: 'success'
                }
                autoLoad: true
            }
        }

        return store

    initComponent: () ->
        me = @
        me.columns = @getColumnConfig()
        me.store = @getStoreConfig()


        if @getUseSaveBar
            me.bbar = [
                {
                    xtype: 'button',
                    text: 'Cancel',
                    iconCls: 'cancel',
                    handler:(menuItem, checked) ->
                        me.cancel()

                }
                {
                    xtype: 'button',
                    id: 'save_button',
                    text: 'Save',
                    iconCls: 'save',
                    handler: (menuItem) ->

                        if me.getEnterEditSummary()
                            Ext.MessageBox.show({
                                title: 'Wijzigingen opslaan',
                                msg: 'Samenvatting',
                                width: 300,
                                multiline: true,
                                buttons: Ext.MessageBox.OKCANCEL,
                                fn: (btn, text)  ->
                                     if (btn=='ok')
                                         me.save()
                            })
                        else
                            me.save()

                }
            ]



        
        @callParent(arguments)
    
})
