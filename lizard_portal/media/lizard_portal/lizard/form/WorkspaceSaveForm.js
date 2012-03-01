
Ext.define('Lizard.form.WorkspaceSaveForm', {
  extend: 'Ext.form.Panel',
  alias: 'widget.workspacesaveform',
  defaultType: 'textfield',
  items: [
    {
      fieldLabel: 'Naam',
      name: 'name',
      allowBlank: false
    }
  ],
  bbar: [
    {
      text: 'save',
      handler: function(btn, event) {
        var store;
        store = Ext.data.StoreManager.lookup('WorkspaceStore');
        store.name = 'blabla';
        store.sync();
        arguments;
        debugger;
      }
    }
  ]
});
