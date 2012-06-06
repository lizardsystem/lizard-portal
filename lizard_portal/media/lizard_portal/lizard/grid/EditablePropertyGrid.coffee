
Ext.create('Vss.store.TimeserieObject')


Ext.define 'Lizard.grid.EditablePropertyGrid',
    extend:'Ext.grid.Panel'
    alias: 'widget.leditpropgrid'
    config:
        proxyUrl: ''
        proxyParams: {}
        useSaveBar: true
        enterEditSummary: true
        editable: true


    extraEditors: {
        timeserie: {
            field: {
                xtype: 'combo'
                store: Ext.create('Vss.store.TimeserieObject',{
                    fixedParameter: ''
                })
                queryMode: 'remote'
                displayField: 'name'
                valueField: 'name'
                forceSelection: true
                typeAhead: true,
                minChars:0,
                triggerAction: 'all',
                selectOnTab: true,
                pageSize: 15
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
        int: {
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
    get_editor: (record, default_editor, me) ->
        if !record.data.editable
            return false

        type = record.data.type

        editor = {
            field: Ext.create('Ext.form.field.ComboBox', {
                editable: false,
                store: [[ 1, 'OK' ], [0, 'Kritisch' ]]
            })
        }
        if type
            if me.extraEditors[type]
                editor = me.extraEditors[type]
            else if @editors[type]
                editor = me.editors[type]

        if Ext.type(editor) == 'object'
            editor = Ext.create('Ext.grid.CellEditor', editor)
            console.log(record.data)
            if type == 'timeserie' and record.data.ts_parameter
                editor.field.store = Ext.create('Vss.store.TimeserieObject',{
                    fixedParameter: record.data.ts_parameter
                })
            return editor
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


    saveEdits: () ->
        @store.sync()

    cancelEdits: () ->
        @store.rejectChanges()

    constructor: () ->
        @initConfig(arguments)
        @callParent(arguments)

    initComponent: () ->
        me = @

        #if !Ext.data.StoreManager.lookup('timeserieobject')
        #Ext.create('Vss.store.TimeserieObject', {,
        #    storeId: 'timeserieobject'
        #});

        if @getEditable()
            @editing = Ext.create('Ext.grid.plugin.CellEditing', {
                        clicksToEdit: 1
                    })
            @plugins.push(@editing)





        if @getUseSaveBar()
            me.bbar = [
                {
                    xtype: 'button',
                    text: 'Annuleren',
                    iconCls: 'cancel',
                    handler:(menuItem, checked) ->
                        me.cancelEdits()

                }
                {
                    xtype: 'button',
                    text: 'Opslaan',
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
            ]

        Ext.apply( this, {
            sortableColumns: false
            hideHeaders: true
            columns: [
                {
                    text: 'Eigenschap'
                    width:200
                    sortable: true
                    dataIndex: 'property'
                }
                {
                    text: 'Waarde'
                    flex:1
                    sortable: true
                    dataIndex: 'value'
                    renderer: me.get_renderer
                    getEditor: (record, default_editor) ->
                        return me.get_editor(record, default_editor, me)
                    field:
                        allowBlank: false
                }
            ]
            store:
                type: 'leditstore'
                fields: [
                    {
                        name: 'id',
                        mapping: 'id'
                    },{
                        name: 'property',
                        mapping: 'property'
                    },{
                        name: 'value',
                        mapping: 'value',
                        type: 'auto',
                        defaultValue: null
                    },{
                        name: 'type',
                        mapping: 'type',
                        type: 'text',
                        defaultValue: 'text'
                    },{
                        name: 'editable',
                        mapping: 'editable',
                        defaultValue: true
                    },{
                        name: 'ts_parameter',
                        mapping: 'ts_parameter'
                    }
                ]
                proxy:
                    type: 'ajax'
                    url: @getProxyUrl()
                    extraParams:
                       _accept: 'application/json'
                    reader:
                        type: 'json'
                        root: 'data',

                    writer:
                        type: 'json',
                        writeAllFields: false,
                        root: 'data',
                        encode: true,
                        successProperty: 'success'

        })

        @callParent arguments


