Ext.define('Lizard.form.BackgroundLayerSelector', {
    extend: 'Ext.form.Panel'
    alias: 'widget.backgroundlayerselector'

    startValue: null,
    bodyStyle: 'padding:5px 5px 0',
    defaults:
        anchor: '100%'
    width: 300,
    init_background: null

    statics:
        show: (config={}) ->
            Ext.create('Ext.window.Window', {
                title: 'Achtergroundkaart selectie'
                is_background_selection: true,
                modal: true,
                items: Ext.create('Lizard.form.BackgroundLayerSelector', config)
            }).show()

    items: [{
        fieldLabel: 'Achtergrondkaart',
        name: 'base_layer',
        displayField: 'title',
        valueField: 'plid',
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
            model: 'Lizard.model.WorkspaceItemModel'
            proxy:
                type: 'ajax',
                url: '/workspace/api/layer_view/?_accept=application%2Fjson',
                extraParams:
                    filter: '[{"property": "is_base_layer", "value": true}]',
                reader:
                    type: 'json',
                    root: 'data'
    }],
    bbar: [
        '->'
    {
        text: 'Annuleren'
        handler: (btn, event) ->
            window = @up('window')
            window.close()
    }
    {
        text: 'OK'
        handler: (btn, event) ->
            form = @up('form').getForm()
            if form.isValid()
                values=form.getValues()
                index = form.findField('base_layer').store.find('plid', values.base_layer)
                base_layer = form.findField('base_layer').store.getAt(index)

                Lizard.CM.setContext({background_layer: base_layer.raw})

                window = @up('window')
                window.close()

            else
                Ext.MessageBox.alert('Invoer fout', 'Kies geldige periode')
    }]
    afterRender: () ->
        form = @getForm()
        form.findField('base_layer').store.load()

        if @init_background_id is null
            @init_background_id = Lizard.CM.getContext().background_layer.id
        if @init_background_id
            form.findField('base_layer').setValue(@init_background_id)
        #save_method = form.findField('save_method')

})
