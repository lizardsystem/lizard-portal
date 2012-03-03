
Ext.define('Lizard.store.Apps', {
  extend: 'Ext.data.Store',
  model: 'Lizard.model.App',
  proxy: {
    type: 'memory',
    reader: {
      type: 'json'
    }
  }
});
