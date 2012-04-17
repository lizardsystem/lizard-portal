Ext.define('Lizard.form.TableField', {
    extend: 'Ext.form.FieldContainer'
    alias: 'widget.tablefield'
    mixins:
        field: 'Ext.form.field.Field'

    config:
        name: ''
        field_name: 'name'
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
    getValue: (jsonFormat=false) ->
        #console.log('getValue')
        #console.log this.store
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

        fields = [{
            text: me.getField_name()
            dataIndex: 'name'
            flex:1
        }]

        if me.extra_fields
            for extra_field in me.extra_fields
                fields.push(extra_field)


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
                }
            ]
        })

        @callParent(arguments)
})
