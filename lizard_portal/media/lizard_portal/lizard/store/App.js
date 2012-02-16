(function() {
  Ext.define('Lizard.store.App', {
    extend: 'Ext.data.Store',
    model: 'Lizard.model.App',
    config: {
      context_ready: false
    },
    proxy: {
      type: 'memory',
      reader: {
        type: 'json'
      }
    }
  });
}).call(this);
