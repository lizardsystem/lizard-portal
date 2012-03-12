(function() {

  Ext.define('Lizard.store.CollageStore', {
    extend: 'Ext.data.Store',
    alias: 'store.collagestore',
    model: 'Lizard.model.CollageModel',
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
          config.collageItemStore = Ext.create('Lizard.store.CollageItemStore', {});
          this.active_stores[storeId] = Ext.create('Lizard.store.CollageStore', config);
        }
        return this.active_stores[storeId];
      }
    },
    listeners: {
      load: {
        fn: function(store, records) {
          var me;
          me = store;
          if (records) {
            if (me.collageItemStore) {
              return me.collageItemStore.loadData(records[0].get('layers'));
            }
          }
        }
      }
    }
  });

}).call(this);
