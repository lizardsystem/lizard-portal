


###
    Fields:






    * combo:
        choices:
            * array with string choices; or
            * array with objects of choices. the objects has a 'id' and 'name' key






  issues:
  - editors are to small
  - multiselect comboboxes doesn't work correct


###

Ext.override(Ext.form.field.Field, {

    isEqual: (a, b) ->
        if Ext.isDate(a) and Ext.isDate(b)
            return a.getTime() == b.getTime()
        else if Ext.isObject(a) and Ext.isObject(b)
            return a.id == b.id
        else if Ext.isArray(a) and Ext.isArray(b)
            #array with dictionaries of related object
            #todo: works for longer arrays and all fields
            console.log(a)
            console.log(b)
            if a.length == 1 and b.length == 1
                console.log(a[0].id == b[0].id)
                return a[0].id == b[0].id

        return a == b;
})




Ext.override(Ext.data.Model, {

    isEqual: (a, b) ->
        if Ext.isDate(a) and Ext.isDate(b)
            return a.getTime() == b.getTime()
        else if Ext.isObject(a) and Ext.isObject(b)
            return a.id == b.id
        else if Ext.isArray(a) and Ext.isArray(b)
            #array with dictionaries of related object
            #todo: works for longer arrays and all fields
            console.log(a)
            console.log(b)
            if a.length == 1 and b.length == 1
                console.log(a[0].id == b[0].id)
                return a[0].id == b[0].id

        return a == b;
})



Ext.define('Lizard.grid.EditableGrid', {
    extend: 'Ext.grid.Panel'
    alias: 'widget.leditgrid'
    config: {
        proxyUrl: ''
        proxyParams: {}
        dataConfig: []
        useSaveBar: true
        enterEditSummary: true
        editable: true
        addEditIcon: false
        addDeleteIcon: false
        actionEditIcon: null
        actionDeleteIcon: null
        usePagination: true
        recordsPerPage:25
    }
    extraEditors: {
        timeserie: {
            editor: {
                xtype: 'combo'
                store: Ext.create('Vss.store.TimeserieObject',{
                    fixedParameter: ''
                }),
                queryMode: 'remote'
                displayField: 'name'
                valueField: 'id'
                forceSelection: true
                typeAhead: true
                minChars:0,
                triggerAction: 'all'
                selectOnTab: true
                pageSize: 15
                width:150
                size: 150
            }
        }
    }
    editors: {
        text:
            field:
                xtype:'textfield'

        oordeel:
            field: Ext.create('Ext.form.field.ComboBox', {
                editable: false
                store: [[ 1, 'OK' ], [0, 'Kritisch' ]]
            })

        boolean:
            field:
                xtype:'checkbox'

        checkbox:
            field:
                xtype:'checkbox'
                step:1

        float:
            field:
                xtype:'numberfield'
                step:1

        number:
            field:
                xtype:'numberfield',
                step:1
                allowDecimals: false,

        date:
            field:
                xtype:'datefield',
                format: 'm d Y',
                altFormats: 'd,m,Y|d.m.Y',
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
                if col.choices and col.choices.length > 0 and Ext.type(col.choices[0]) == 'object'
                    console.log('combodict')
                    editor = {
                        field: {
                            xtype: 'combodict'
                            displayField: 'name'
                            valueField: 'id'
                            return_json: false
                            store:
                                fields: ['id', 'name']
                                data: col.choices
                            queryMode: 'local'
                            multiSelect: col.multiSelect || false
                            forceSelection: true
                            triggerAction: 'all'
                            selectOnTab: true
                        }

                    }
                else if col.remote
                    console.log('gridcombobox')
                    editor = {
                        field: {
                            xtype: 'gridcombobox'
                            store: col.store
                            queryMode: 'remote'
                            displayField: 'name'
                            valueField: 'id'
                            return_json: false
                            forceSelection: true
                            typeAhead: true
                            minChars:0,
                            triggerAction: 'all'
                            selectOnTab: true
                            pageSize: 15
                            width:150
                            size: 150
                        }
                    }
                else
                    console.log('combo')
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
            else if type == 'gridcombobox'
                if col.remote
                    editor = {
                        field: {
                            xtype: 'gridcombobox'
                            store: col.store
                            queryMode: 'remote'
                            displayField: 'name'
                            valueField: 'id'
                            forceSelection: true
                            typeAhead: true
                            minChars:0,
                            triggerAction: 'all'
                            selectOnTab: true
                            pageSize: 15
                            width:150
                            size: 150
                        }
                    }
                else
                    editor = {
                        field: {
                            xtype: 'gridcombobox'
                            displayField: 'name',
                            valueField: 'id',
                            store: {
                                fields: ['id', 'name'],
                                data: col.choices
                            },
                            queryMode: 'local'
                            forceSelection: true
                            triggerAction: 'all',
                            selectOnTab: true,
                            multiSelect: col.multiSelect
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

        if col.type in ['combo', 'gridcombobox']
            if Ext.type(value) == 'object'
                value = value.name
                #else just the value
            if Ext.type(value) == 'array'
                names = []
                for val in value
                    names.push(val.name)
                value = names.join(', ')
                #else just the value

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

        #function with default settings
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
            if col.multiSelect
                col_config.multiSelect = true
            return col_config

        cols = []


        if @addEditIcon or @addDeleteIcon
            colConfig = {
                xtype:'actioncolumn',
                width:50,
                items: []
            }

            if @addEditIcon
                colConfig.items.push({
                        #todo: iconCls is better, but doesn't work
                        icon: '/static_media/lizard_portal/images/settingtable.png',
                        tooltip: 'Edit',
                        handler: (grid, rowIndex, colIndex) ->
                            rec = grid.getStore().getAt(rowIndex)
                            if me.actionEditIcon
                                me.actionEditIcon(rec)
                            else
                                alert("Edit " + rec.get('id'))
                    })

            if @addDeleteIcon
                colConfig.items.push({
                        #todo: iconCls is better, but doesn't work
                        icon: '/static_media/lizard_portal/images/delete.png',
                        #xtype: 'button'
                        tooltip: 'Delete',
                        handler: (grid, rowIndex, colIndex) ->
                            rec = grid.getStore().getAt(rowIndex)
                            me.store.remove(rec)
                    })
            cols.push(colConfig)

        for col in @dataConfig
            if !col.columns
                cols.push(getColconfig(col))
            else
                cols_with_header = {text: col.title, columns: []}
                for col_sub in col['columns']
                    cols_with_header['columns'].push(getColconfig(col_sub))
                cols.push(cols_with_header)

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


        getGridFieldSettings = (setting) ->
            field = {
                name: setting.name
                type: setting.type || 'auto'
                mapping: setting.mapping || setting.name
            }
            if setting.type in ['combo', 'gridcombo']
                field.sortType = 'asIdNameObject'

            return field


        for field in @dataConfig

            if field.columns
                for subfield in field.columns
                    fields.push(getGridFieldSettings(subfield))

            else
                fields.push(getGridFieldSettings(field))


        url = @getProxyUrl()

        params = []
        proxyparams = @getProxyParams()

        console.log('++++++++++++++')
        console.log(proxyparams)

        Ext.Object.each(@getProxyParams(), (key, value) ->
            params.push( key + '=' + value)
            console.log(params)
        )

        params = params.join('&')

        console.log(params)
        console.log('++++++++++++++')

        store = {
            type: 'leditstore'
            fields: fields
            pageSize: @recordsPerPage
            proxy: {
                type: 'ajax'
                api:
                    create: "#{url}?_accept=application/json&flat=false&action=create&#{params}" # Called when saving new records
                    read: "#{url}?_accept=application/json&#{params}" # Called when reading existing records
                    update: "#{url}?_accept=application/json&flat=false&action=update&#{params}" # Called when updating existing records
                    destroy: "#{url}?_accept=application/json&flat=false&action=delete&#{params}" # Called when deleting existing records
                extraParams: {
                }
                reader: {
                    type: 'json'
                    root: 'data'
                    totalProperty: 'count'
                }
                writer: {
                    type: 'json',
                    writeAllFields: false,
                    root: 'data',
                    encode: true,
                    successProperty: 'success'
                    totalProperty: 'count'
                }
                #autoLoad: true
            }
        }


        return store

    initComponent: () ->
        me = @

        if not @getUsePagination()
            @recordsPerPage = 10000




        me.columns = @getColumnConfig()
        me.store = Ext.create('Lizard.store.EditGridStore', @getStoreConfig())
        me.bbar = []

        if @getEditable()
            @editing = Ext.create('Lizard.grid.CellEditing', {
                        clicksToEdit: 1
                    })
            @plugins.push(@editing)

            me.bbar = [
                {
                    xtype: 'button',
                    text: 'Toevoegen',
                    iconCls: 'l-icon-add',
                    handler:(menuItem, checked) ->
                        me.addRecord()

                }
                {
                    xtype: 'button',
                    text: 'Delete',
                    iconCls: 'l-icon-delete',
                    handler:(menuItem, checked) ->
                        me.deleteSelectedRecord()

                }
            ]

        if @getEditable() and @getUseSaveBar()
            me.bbar = me.bbar.concat([
                '-'
                {
                    xtype: 'button',
                    text: 'Cancel',
                    iconCls: 'l-icon-cancel',
                    handler:(menuItem, checked) ->
                        me.cancelEdits()

                }
                {
                    xtype: 'button',
                    text: 'Save',
                    iconCls: 'l-icon-disk',
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
                                         me.store.setTempWriteParams({edit_message: text})
                                         me.saveEdits()
                            })
                        else
                            me.saveEdits()

                }

            ])

        if @getUsePagination()
            @bbar =
                {
                    xtype: 'pagingtoolbar'
                    pageSize: @recordsPerPage,
                    store: me.store,
                    displayInfo: true,
                    items: ['-'].concat(me.bbar)

                }



#grid - The grid
#record - The record being edited
#field - The field name being edited
#value - The value being set
#originalValue - The original value for the field, before the edit.
#row - The grid table row
#column - The grid Column defining the column that is being edited.
        
        @callParent(arguments)
    
})
