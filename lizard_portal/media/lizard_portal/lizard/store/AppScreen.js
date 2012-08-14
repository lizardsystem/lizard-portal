(function() {

  Ext.define('Lizard.store.AppScreen', {
    extend: 'Ext.data.Store',
    model: 'Lizard.model.AppScreen',
    proxy: {
      type: 'ajax',
      url: '/workspace/api/appscreen',
      extraParams: {
        _accept: 'application/json'
      },
      reader: {
        type: 'json',
        root: 'data'
      }
    }
  });

}).call(this);
