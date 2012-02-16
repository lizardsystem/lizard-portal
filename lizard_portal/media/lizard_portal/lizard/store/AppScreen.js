(function() {
  "Just copied";
  Ext.define('Lizard.store.AppScreen', {
    extend: 'Ext.data.Store',
    model: 'Lizard.model.AppScreen',
    config: {
      context_ready: false
    },
    proxy: {
      type: 'memory',
      reader: {
        type: 'json'
      }
    },
    applyContext: function(changes, context) {
      console.arguments;
      return this.context_ready = true;
    }
  });

}).call(this);
