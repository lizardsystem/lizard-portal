
Ext.create('Vss.store.TimeserieObject')


Ext.define 'Lizard.grid.EditablePropertyGrid',
    extend:'Ext.grid.Panel'
    alias: 'widget.leditpropgrid'
    config:
        special: true
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

    initComponent: () ->
        me = this

        #if !Ext.data.StoreManager.lookup('timeserieobject')
        #Ext.create('Vss.store.TimeserieObject', {,
        #    storeId: 'timeserieobject'
        #});


        Ext.apply( this, {
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
                    field: {
                        allowBlank: false
                    }
                }
            ]
        })

        @callParent arguments
        return this


