(function() {
  Ext.define('Lizard.store.AvailableLayersStore', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.availablelayersstore',
    rootVisible: false,
    autoLoad: false,
    proxy: {
      type: 'ajax',
      url: '/workspace/api/app_layer_tree/',
      reader: {
        type: 'json'
      }
    }
  });
}).call(this);
