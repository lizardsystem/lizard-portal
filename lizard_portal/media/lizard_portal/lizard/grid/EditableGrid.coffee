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
                store: Ext.create('Vss.store.TimeserieObject',{
                    fixedParameter: ''
                }),
                queryMode: 'remote'
                displayField: 'name'
                valueField: 'name'
                forceSelection: true
                typeAhead: true,
                minChars:0,
                triggerAction: 'all',
                selectOnTab: true,
                pageSize: 15,
                width:150,
                size: 150
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
        checkbox: {
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

        if typeof(col.editable) == 'undefined'
            col.editable = true
            
        if !col.editable
            return false

        type = col.type || 'text'

        if type
            if me.extraEditors[type]
                editor = me.extraEditors[type]
            else if @editors[type]
                editor = me.editors[type]
            else if type == 'combo'
                editor = {
                    field: {
                        xtype: 'combo'
                        store: col.choices
                        queryMode: 'local'
                        forceSelection: true
                        triggerAction: 'all',
                        selectOnTab: true,
                    }

                }




        if Ext.type(editor) == 'object'
            editor = Ext.create('Ext.grid.CellEditor', editor)

            if type == 'timeserie' and col.ts_parameter
                editor.field.store = Ext.create('Vss.store.TimeserieObject',{
                    fixedParameter: col.ts_parameter
                })

            return editor
        else
            return editor

    get_renderer: (value, style, record, rownr, colnr, store, gridpanel, col) ->

        if value == null
            value = '-'

        if col.type == 'boolean'
            if value == true
                value = 'ja'
            else if value == false
                value = 'nee'

        if !col.editable
            value = "<i>#{value}</i>"

        if col.editIf
            if !Ext.Array.contains(col.editIf.value_in, record.data[col.editIf.prop])
                console.log('grijs')
                value = "<span style='color:#888;'>#{value}</span>"

        return value


    constructor: () ->
        @initConfig(arguments)
        @callParent(arguments)

    getColumnConfig: () ->
        me = @

        getColconfig = (col) ->
            col_config = {
                text: col.title
                width: col.width || 100
                sortable: true
                hidden: !col.visible
                dataIndex: col.name
                type: col.type
                editable: col.editable || false
                renderer: Ext.Function.bind(me.get_renderer, me, [col], true)
            }
            if col.editable
                col_config.getEditor = Ext.Function.bind(
                    (record, col) ->
                        return me.get_editor(col)
                    me
                    [col]
                    true
                )

            if col.editIf
                col_config.editIf = col.editIf

            return col_config

        cols = []
        for col in @dataConfig
            if !col.columns
                cols.push(getColconfig(col))
            else
                cols_with_header = {text: col.title, columns: []}
                for col_sub in col['columns']
                    cols_with_header['columns'].push(getColconfig(col_sub))

                cols.push(cols_with_header)

        console.log(cols)

        return cols


    saveEdits: () ->
        @store.sync()

    cancelEdits: () ->
        @store.rejectChanges()

    addRecord: () ->

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

            if field.columns
                for subfield in field.columns
                    fields.push({
                        name: subfield.name
                        type: subfield.type || 'auto'
                        mapping: subfield.mapping || subfield.name
                    })

            else


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






        if @getEditable() and @getUseSaveBar()
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
