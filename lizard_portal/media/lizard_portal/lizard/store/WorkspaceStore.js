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
    },
    listeners: {
      load: {
        fn: function(store, records) {
          var background_index, background_pref, index, me, old_background;
          me = store;
          arguments;
          debugger;
          if (records) {
            index = me.workspaceItemStore.find('is_base_layer', true);
            old_background = me.workspaceItemStore.getAt(index);
            if (me.workspaceItemStore) {
              me.workspaceItemStore.loadData(records[0].get('layers'));
            }
            background_index = me.workspaceItemStore.find('is_base_layer', true);
            if (background_index < 0) {
              background_pref = Lizard.CM.getContext().background_layer;
              if (background_pref) {
                return me.workspaceItemStore.insert(0, background_pref);
              } else {
                return me.workspaceItemStore.insert(0, old_background);
              }
            }
          }
        }
      }
    }
  });

}).call(this);
