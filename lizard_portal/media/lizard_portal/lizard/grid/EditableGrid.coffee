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
    extraEditors: {
        timeserie: {
            field: {
                xtype: 'combo'
                store: 'timeserieobject'
                queryMode: 'remote'
                displayField: 'name'
                valueField: 'name'
                forceSelection: true
                typeAhead: true,
                minChars:0,
                triggerAction: 'all',
                selectOnTab: true
            }
        }
    }
    editors: {
        text: {
            field: {
                xtype:'textfield'
            }
        }
        oordeel: {
            field: Ext.create('Ext.form.field.ComboBox', {
                editable: false,
                store: [[ 1, 'OK' ], [0, 'Kritisch' ]]
            })
        }
        boolean: {
            field: {
                xtype:'checkbox',
                step:1
            }
        },
        float: {
            field: {
                xtype:'numberfield',
                step:1
            }
        },
        number: {
            field: {
                xtype:'numberfield',
                step:1
            }
        },
        date: {
            field: {
                xtype:'datefield',
                format: 'm d Y',
                altFormats: 'd,m,Y|d.m.Y',
            }
        }
    }
    get_editor: (col) ->
        me = @
        console.log(col)

        if typeof(col.editable) == 'undefined'
            col.editable = true
            
        if !col.editable
            console.log
            return false

        type = col.type || 'text'

        if type
            if me.extraEditors[type]
                editor = me.extraEditors[type]
            else if @editors[type]
                editor = me.editors[type]

        if Ext.type(editor) == 'object'
            return Ext.create('Ext.grid.CellEditor', editor)
        else
            return editor

    get_renderer: (value, metaData, record) ->
        #record.data.manual
        if value == null
            value = '-'
        if record.data.type == 'boolean'
            if value == true
                value = 'ja'
            else if value == false
                value = 'nee'


        if !record.data.editable
            value = "<i>#{value}</i>"

        return value


    constructor: () ->
        @initConfig(arguments)
        @callParent(arguments)

    getColumnConfig: () ->
        cols = []
        for col in @dataConfig

            col_config = {
                text: col.title
                width: col.width || 100
                sortable: true
                hidden: !col.visible
                dataIndex: col.name
            }
            if @get_editor(col)
                #todo: change field to editor after upgrade to Ext 4.07
                col_config.field = @get_editor(col)

            console.log(col_config)
            cols.push(col_config)

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

        url = @getProxyUrl()

        store = {
            type: 'leditstore'
            fields: fields
            proxy: {
                type: 'ajax'
                api:
                    create: "#{url}?action=create" # Called when saving new records
                    read: url # Called when reading existing records
                    update: "#{url}?action=update" # Called when updating existing records
                    destroy: "#{url}?action=delete" # Called when deleting existing records
                extraParams: {
                   _accept: 'application/json'
                }
                reader: {
                    type: 'json'
                    root: 'data'
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


        if @getEditable()
            @editing = Ext.create('Ext.grid.plugin.CellEditing', {
                        clicksToEdit: 1
                    })
            @plugins.push(@editing)

            me.bbar = [
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






        if @getUseSaveBar()
            me.bbar.concat([
                '-'
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
            ])





        
        @callParent(arguments)
    
})
