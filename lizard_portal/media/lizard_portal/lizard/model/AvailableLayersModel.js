(function() {

  Ext.define('Lizard.model.AvailableLayersModel', {
    extend: 'Ext.data.Model',
    fields: [
      {
        name: 'plid',
        mapping: 'plid',
        type: 'auto'
      }, {
        name: 'checked',
        type: 'boolean'
      }, {
        name: 'text',
        type: 'string'
      }, {
        name: 'leaf',
        type: 'boolean'
      }
    ]
  });

}).call(this);
