(function() {

  Ext.define('Lizard.store.WorkspaceStore', {
    extend: 'Ext.data.Store',
    alias: 'store.workspacestore',
    model: 'Lizard.model.WorkspaceModel',
    autoLoad: false,
    workspaceItemStore: null,
    statics: {
      active_stores: {},
      remove: function(store) {
        if (this.active_stores[store.storeId]) {
          return delete this.active_stores[store.storeId];
        }
      },
      get_or_create: function(storeId, config) {
        if (config == null) config = {};
        if (!this.active_stores[storeId]) {
          config.storeId = storeId;
          config.workspaceItemStore = Ext.create('Lizard.store.WorkspaceItemStore', {});
          this.active_stores[storeId] = Ext.create('Lizard.store.WorkspaceStore', config);
        }
        return this.active_stores[storeId];
      }
    }
  });

}).call(this);
