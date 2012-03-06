(function() {

  Ext.define('Lizard.store.Apps', {
    extend: 'Ext.data.Store',
    model: 'Lizard.model.App',
    autoLoad: false
  });

}).call(this);
