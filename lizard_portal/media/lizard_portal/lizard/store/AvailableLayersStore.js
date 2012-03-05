(function() {

  Ext.define('Lizard.store.AvailableLayersStore', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.availablelayersstore',
    root: {
      text: 'Title',
      expanded: true,
      id: 'root-id'
    },
    autoLoad: true,
    proxy: {
      type: 'ajax',
      url: '/workspace/api/layer_view/',
      reader: {
        type: 'json',
        root: 'data'
      }
    },
    fields: ['id', 'text']
  });

}).call(this);
