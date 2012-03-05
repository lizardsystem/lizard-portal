(function() {
  Ext.define('Lizard.store.WorkspaceStore', {
    extend: 'Ext.data.Store',
    alias: 'store.workspacestore',
    model: 'Lizard.model.WorkspaceModel',
    autoLoad: false,
    layerStore: null
  });
}).call(this);
