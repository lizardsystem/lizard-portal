Ext.define('Lizard.form.WorkspaceSaveForm', {
    extend: 'Ext.form.Panel'
    alias: 'widget.workspacesaveform'
    defaultType: 'textfield',
    items: [{
          fieldLabel: 'Naam',
          name: 'name',
          allowBlank: false
      }],
    bbar: [{
        text: 'save'
        handler: (btn, event) ->
            # Bastiaan: hoe moet dat?
            # Store the name in the workspace store and sync workspace store.
            # @items
            # @store.sync()
            store = Ext.data.StoreManager.lookup('WorkspaceStore')
            store.name = 'blabla'
            store.sync()
            arguments
            debugger
      }]
  })
