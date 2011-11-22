Ext.define('Lizard.grid.EditableGrid', {
    extend: 'Ext.grid.Panel'
    alias: 'widget.leditgrid'
    config: {
        proxyUrl: '/portal/wbbuckets.json'
        proxyParams: {}
        dataConfig: []
        useSaveBar: true
        enterEditSummary: true
        editable: true
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


    saveEdits: () ->
        @store.sync()

    cancelEdits: () ->
        @store.rejectChanges()

    addRecord: () ->
        rec = {
            first: '',
            last: '',
            email: ''
        }

        @store.insert(0, {})

        if @editing

            edit = @editing
            edit.cancelEdit()
            edit.startEditByPosition({
                row: 0,
                column: 1
            })

    deleteSelectedRecord: () ->
        selection = @getView().getSelectionModel().getSelection()[0]
        if selection
            @store.remove(selection)
        
    

    getStoreConfig: () ->
        fields = []
        for field in @dataConfig

            fields.push({
                name: field.name
                type: field.type || 'auto'
                mapping: field.mapping || field.name
            })

        store = {
            type: 'leditstore'
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


        if @getEditable
            @editing = Ext.create('Ext.grid.plugin.CellEditing', {
                        clicksToEdit: 1
                    })
            @plugins.push(@editing)





        if @getUseSaveBar
            me.bbar = [
                {
                    xtype: 'button',
                    text: 'Cancel',
                    iconCls: 'cancel',
                    handler:(menuItem, checked) ->
                        me.cancelEdits()

                }
                {
                    xtype: 'button',
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
                                         me.saveEdits()
                            })
                        else
                            me.saveEdits()

                }
                '-'
                {
                    xtype: 'button',
                    text: 'Toevoegen',
                    iconCls: 'add',
                    handler:(menuItem, checked) ->
                        me.addRecord()

                }
                {
                    xtype: 'button',
                    text: 'Delete',
                    iconCls: 'add',
                    handler:(menuItem, checked) ->
                        me.deleteSelectedRecord()

                }

            ]



        
        @callParent(arguments)
    
})
