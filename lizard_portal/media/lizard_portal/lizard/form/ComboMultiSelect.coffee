Ext.define('Lizard.form.ComboMultiSelect', {
    extend: 'Ext.form.FieldContainer'
    alias: 'widget.combomultiselect'
    mixins:
        field: 'Ext.form.field.Field'

    config:
        name: ''
        field_name: 'name'
        read_at_once: false
        combo_store: null
        options: null
        extra_fields: null
        editable: false
        plugins: []

    #docs inherit from Mixin Field
    #todo: finish this function
    setValue: (value) ->
        me = @
        me.mixins.field.setValue.call(me, value)

        if Ext.type(value) == 'array'
            for v in value
                @store.add(v)
        else if Ext.type(value) == 'object'
            @store.add(value)

        return @

    #docs inherit from Mixin Field
    #todo: add extra fields
    getValue: (jsonFormat=false) ->
        console.log('getValue')
        console.log this.store
        me = @
        values = []
        this.store.data.each((ref) ->
            values.push(ref.data)
        )
        if jsonFormat
            return Ext.JSON.encode(values)
        return values

    getSubmitValue: () ->
        return @getValue()

    getSubmitData: () ->
        data = {}
        data[@.name] = @getValue()
        return data

    constructor: () ->
        @initConfig(arguments)
        @callParent(arguments)

        @initField()

    initComponent: () ->
        me = @

        @store = Ext.create('Ext.data.Store',
            fields: ['id', 'name']
            proxy:
                type: 'memory'
        )

        if @getOptions()
            #todo: test this option
            @combo_store = @getOptions()

        fields = [{
            text: me.getField_name()
            dataIndex: 'name'
            flex:1
        }]

        if me.extra_fields
            for extra_field in me.extra_fields
                fields.push(extra_field)

        fields.push({
                xtype: 'actioncolumn'
                width: 50
                items: [
                    icon: '/static_media/lizard_portal/images/delete.png'
                    tooltip: 'Verwijder item'
                    handler: (grid, rowIndex, colIndex) ->
                        rec = grid.store.getAt(rowIndex)
                        grid.store.remove(rec)
                ]

        })



        if @getEditable()
            plugins = [Ext.create('Ext.grid.plugin.CellEditing', {
                        clicksToEdit: 1
                    })]
        else
            plugins = []

        Ext.apply(@, {
            layout: 'anchor'
            defaults:
                anchor: '100%'
            fieldDefaults:
                msgTarget: 'under'
                labelAlign: 'top'
            items: [
                {
                    autoHeight:true
                    xtype: 'gridpanel'
                    store: me.store
                    columns: fields,
                    plugins: plugins
                },
                {
                    #fieldLabel: 'Choose State',
                    xtype: 'combo'
                    store: me.combo_store
                    queryMode: 'remote' #'local' 'remote
                    displayField: 'name'
                    valueField: 'id'
                    forceSelection: true
                    typeAhead: true,
                    minChars:0,
                    triggerAction: 'all',
                    selectOnTab: true,
                    listeners:
                        scope: me
                        'select': (combobox, rec, scope) ->
                            if @store.indexOf(rec[0]) < 0
                                @store.add(rec[0])
                                combobox.setValue('')

                }
            ]
        })

        @callParent(arguments)
})
