(function() {

  Ext.define('Lizard.model.App', {
    extend: 'Ext.data.Model',
    idProperty: 'slug',
    fields: [
      {
        name: 'name',
        mapping: 'name',
        type: 'text'
      }, {
        name: 'description',
        mapping: 'description',
        type: 'text'
      }
    ]
  });

}).call(this);
