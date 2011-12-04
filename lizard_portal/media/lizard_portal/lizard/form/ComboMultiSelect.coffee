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

    #docs inherit from Mixin Field
    setValue: (value) ->
        me = @

        me.mixins.field.setValue.call(me, value)
        if (value == null || value == undefined)
            value = ''
        me.store.removeAll()
        me.store.add({id:33, name:'todo'})

        return @

    #docs inherit from Mixin Field
    getValue : () ->
        console.log('getValue')
        console.log this.store
        me = @
        values = []
        this.store.data.each( (ref) ->
            values.push({
                id: ref.data.id
                name: ref.data.name
            })
        )
        return Ext.JSON.encode(values)
    


    constructor: () ->
        @initConfig(arguments)
        @callParent(arguments)

        @initField()

    initComponent: () ->
        me = @

        @store = Ext.create('Ext.data.Store',
            fields: ['id', 'name']
            proxy: {
                type: 'memory'
            }

        )

        if @getOptions()
            #todo: test this option
            @combo_store = @getOptions()



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
                    columns: [{
                        text: me.getField_name()
                        dataIndex: 'name'
                        flex:1
                    },{
                        xtype: 'actioncolumn'
                        width: 50
                        items: [
                            #todo: change icon and ref
                            icon: 'http://dev.sencha.com/deploy/ext-4.0.7-gpl/examples/shared/icons/fam/delete.gif'
                            tooltip: 'Verwijder item'
                            handler: (grid, rowIndex, colIndex) ->
                                rec = grid.store.getAt(rowIndex)
                                grid.store.remove(rec)
                        ]

                    }],

                    viewConfig:
                        plugins:
                            ptype: 'gridviewdragdrop'
                            dropGroup: 'firstGridDDGroup'
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