
Ext.define('Lizard.window.HeaderTab', {
  alias: 'widget.headertab',
  config: {
    title: '',
    name: '',
    popup_navigation: false,
    popup_navigation_portal: false,
    navigation: null,
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
