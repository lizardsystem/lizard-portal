(function() {

  Ext.define('Lizard.store.Graph', {
    extend: 'Ext.data.Store',
    model: 'Lizard.model.Graph',
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
      var rec, _i, _len, _ref;
      console.arguments;
      _ref = this.data.items;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        rec = _ref[_i];
        rec.set('dt_start', Ext.Date.format(context.period_start, 'Y-m-d H:i:s'));
        rec.set('dt_end', Ext.Date.format(context.period_end, 'Y-m-d H:i:s'));
        if (rec.get('use_context_location')) {
          rec.set('location', context.object_id);
        }
      }
      return this.context_ready = true;
    }
  });

}).call(this);
