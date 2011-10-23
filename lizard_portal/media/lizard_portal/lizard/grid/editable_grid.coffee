
Ext.define 'Lizard.grid.EditableGrid',
    extend:'Ext.container.grid'
    plugin:[ Ext.create('Ext.grid.plugin.CellEditing',
                 clicksToEdit: 1
    )]
    uses: [ 'Ext.grid.*'
            'Ext.data.*'
            'Ext.button.*'
            'Lizard.ux.CheckColumn'
            'Ext.MessageBox']
    config:
        special: true


    onCancel: ->


    onSave: ->


    getModel: ->


    getStore:->
        Ext.create 'Ext.data.TreeStore'
            proxy:
                type: 'ajax'
                url: '/portal/example_treedata.json'
                extraParams:
                    isJSON: true
                reader:
                    type: 'json'


    getProxy: ->







    initComponent: (arguments) ->


        bbar_config = [{
            xtype: 'button'
            title: 'cancel'
            handler: ->
                alert('cancel')
        },{
            xtype: 'button'
            title: 'save'
            handler: ->
                alert('save')
        }]





        Ext.apply this,

            layout:

                collapsible: false
                floatable: false
                frame: false
            bbar: bbar_config
            





        Lizard.grid.EditableGrid.superclass.initComponent.apply this, arguments
        return this


