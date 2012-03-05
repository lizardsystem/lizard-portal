(function() {

  Ext.define('Lizard.store.AppScreen', {
    extend: 'Ext.data.Store',
    model: 'Lizard.model.App',
    proxy: {
      type: 'memory',
      reader: {
        type: 'json'
      }
    }
  });

}).call(this);
