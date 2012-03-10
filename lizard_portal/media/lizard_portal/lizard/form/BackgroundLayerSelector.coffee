Ext.define('Lizard.form.BackgroundLayerSelector', {
    extend: 'Ext.form.Panel'
    alias: 'widget.backgroundlayerselector'

    startValue: null,

    defaults:
        anchor: '100%'
    width: 300,

    items: [{
        fieldLabel: 'Achtergrondkaart',
        name: 'base_layer',
        displayField: 'name',
        valueField: 'id',
        xtype: 'combo',
        queryMode: 'local'
        autoSelect: true,
        typeAhead: false,
        value: @startValue,
        minChars:0,
        forceSelection: true,
        allowBlank:false,
        width: 200,
        store:
            pageSize: 10000
            fields: ['id', 'name'],
            proxy:
                type: 'ajax',
                url: '/workspace/api/layer_view/?_accept=application%2Fjson',
                extraParams:
                    filter: '[{"property": "is_base_layer", "value": true}]',
                reader:
                    type: 'json',
                    root: 'data'
    }],
    bbar: [{
        text: 'Annuleren'
        handler: (btn, event) ->
            window = @up('window')
            window.close()
    }
    {
        text: 'Opslaan'
        handler: (btn, event) ->
            form = @up('form').getForm()
            if form.isValid()
                debugger
                values=form.getValues()
                base_layer = form.findField('base_layer').store.getById(values.base_layer).raw
                Lizard.CM.setContext({background_layer: base_layer})

                window = @up('window')
                window.close()
                #todo: set workspaceStore on this item
                #else
                #    Ext.MessageBox.alert('Invoer fout', 'Begin datum moet voor eind datum zijn.')

            else
                Ext.MessageBox.alert('Invoer fout', 'Kies geldige periode')
    }]
    afterRender: () ->
        form = @getForm()
        form.findField('base_layer').store.load()
        #save_method = form.findField('save_method')

})
