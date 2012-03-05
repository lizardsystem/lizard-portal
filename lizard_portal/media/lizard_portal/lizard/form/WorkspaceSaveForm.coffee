Ext.define('Lizard.form.WorkspaceSaveForm', {
    extend: 'Ext.form.Panel'
    alias: 'widget.workspacesaveform'
    defaultType: 'textfield',
    #layerStore
    #workspaceStore
    bodyStyle: 'padding:5px',
    defaults:
        anchor: '100%'
    width: 400,

    items: [{
        xtype: 'radiogroup',
        name: 'save_method',
        fieldLabel: 'Overschrijven?',
        columns: 1,
        vertical: true,
        items: [
            { boxLabel: 'Geladen workspace overschrijven', name: 'method', inputValue: 'update'},
            { boxLabel: 'Opslaan als nieuwe workspace', name: 'method', inputValue: 'create'},
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
            form = @up('form').getForm()
            if form.isValid()

                form_values = form.getValues()
                if form_values.method == 'update'
                    workspace = form.workspaceStore.first()

                else
                    workspace = Ext.create('Lizard.model.WorkspaceModel', {

                                });

                workspace.set('name', form_values.name)
                workspace.set('personal_category', form_values.personal_category)

                layers = form.layerStore
                workspace_layers = []
                order_nr = 0

                layers.each( (record) ->
                    record.order = order_nr
                    order_nr += 1
                    workspace_layers.push(record.store.proxy.writer.getRecordData(record))
                    return
                )
                workspace.set('layers', workspace_layers)

                workspace.save()

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
        save_method = form.findField('save_method')

        if  @workspaceStore.getTotalCount() > 0
            save_method = form.findField('save_method')
            save_method.setValue({method:'update'})
            form.findField('name').setValue(@workspaceStore.first().get('name'))
            form.findField('personal_category').setValue(@workspaceStore.first().get('personal_category'))

        else
            save_method.setValue({method:'create'})
            save_method.setDisabled(true)

})
