(function() {

  Ext.define('Lizard.model.App', {
    extend: 'Ext.data.Model',
    idProperty: 'slug',
    fields: [
      {
        name: 'slug',
        mapping: 'slug',
        type: 'text'
      }, {
        name: 'name',
        mapping: 'name',
        type: 'text'
      }, {
        name: 'description',
        mapping: 'description',
        type: 'text'
      }, {
        name: 'mouse_over',
        mapping: 'mouse_over',
        type: 'text'
      }, {
        name: 'icon',
        mapping: 'icon',
        type: 'text'
      }, {
        name: 'action_type',
        mapping: 'action_type',
        type: 'number'
      }, {
        name: 'action_params',
        mapping: 'action_params',
        type: 'auto'
      }, {
        name: 'target_app_slug',
        mapping: 'target_app_slug',
        type: 'auto'
      }
    ],
    proxy: {
      type: 'ajax',
      url: '/workspace/api/appscreen',
      reader: {
        type: 'json',
        root: 'data'
      }
    }
  });

}).call(this);
