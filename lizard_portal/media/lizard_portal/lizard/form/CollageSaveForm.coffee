Ext.define('Lizard.form.CollageSaveForm', {
    extend: 'Ext.form.Panel'
    #extend: 'Lizard.form.WorkspaceSaveForm'

    alias: 'widget.collagesaveform'
    defaultType: 'textfield',
    #layerStore
    #workspaceStore
    bodyStyle: 'padding:5px',
    defaults:
        anchor: '100%'
    width: 400,
    save_callback: Ext.emptyFn

    items: [{
        xtype: 'radiogroup',
        name: 'save_method',
        fieldLabel: 'Overschrijven?',
        columns: 1,
        vertical: true,
        items: [
            { boxLabel: 'Geladen collage overschrijven', name: 'method', inputValue: 'update'},
            { boxLabel: 'Opslaan als nieuwe collage', name: 'method', inputValue: 'create'},
        ]
    }
    {
        fieldLabel: 'Naam',
        name: 'name',
        allowBlank: false
    }
    {
        fieldLabel: 'Persoonlijk tag',
        name: 'personal_category',
        allowBlank: true
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
            # Bastiaan: hoe moet dat?
            # Store the name in the workspace store and sync workspace store.
            # @items
            # @store.sync()
            panel = @up('form')
            form = panel.getForm()
            if form.isValid()

                form_values = form.getValues()
                if form_values.method == 'update'
                    collage = form.collageStore.first()

                else
                    collage = Ext.create('Lizard.model.CollageModel', {

                                });

                collage.set('name', form_values.name)
                collage.set('personal_category', form_values.personal_category)

                layers = form.layerStore
                collage_layers = []
                order_nr = 0

                layers.each( (record) ->
                    # if not form_values.including_background and record.get('is_base_layer')
                    #     return

                    record.order = order_nr
                    order_nr += 1
                    record.commit()

                    collage_layers.push(record.store.proxy.writer.getRecordData(record))
                    return
                )
                collage.set('layers', collage_layers)

                panel.setLoading(true)
                collage.save({
                    callback: (record, operation) ->
                        if operation.wasSuccessful()
                            form.collageStore.removeAll()
                            form.collageStore.add(record)
                            panel.save_callback(record)

                        panel.setLoading(false)
                        window = panel.up('window')
                        window.close()
                })


                #todo: set workspaceStore on this item
                #else
                #    Ext.MessageBox.alert('Invoer fout', 'Begin datum moet voor eind datum zijn.')

            else
                Ext.MessageBox.alert('Invoer fout', 'Kies geldige periode')
    }]
    afterRender: () ->
        form = @getForm()
        save_method = form.findField('save_method')

        if  @collageStore.count() > 0 and not @collageStore.first().get('read_only')
            bla = @collageStore.first().get('read_only')
            save_method = form.findField('save_method')
            save_method.setValue({method:'update'})
            form.findField('name').setValue(@collageStore.first().get('name'))
            form.findField('personal_category').setValue(@collageStore.first().get('personal_category'))

        else
            save_method.setValue({method:'create'})
            save_method.setDisabled(true)


})
