(function() {
  Ext.define('Lizard.window.HeaderTab', {
    alias: 'widget.headertab',
    config: {
      title: '',
      name: '',
      navigation_portal_template: null,
      navigation: {
        id: 'emptyNavigation'
      },
      default_portal_template: '',
      active_portal_template: null,
      object_types: []
    },
    constructor: function(config) {
      this.initConfig(config);
      return this.callParent(arguments);
    },
    initComponent: function() {
      var me;
      me = this;
      return this.callParent(arguments);
    }
  });
}).call(this);
