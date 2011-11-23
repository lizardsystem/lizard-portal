(function() {
  Ext.define('Lizard.window.ContextManager', {
    config: {
      active_tab: '',
      user: {
        id: '',
        name: '',
        permission_description: 'viewer',
        permissions: []
      },
      period_time: {
        period_start: '2000-01-01T00:00',
        period_end: '2002-01-01T00:00'
      },
      object: {
        type: 'aan_afvoergebied',
        id: null
      },
      sub_object: {
        type: 'annotatie',
        id: null
      },
      template: {
        portalTemplate: 'homepage',
        base_url: 'portal/watersysteem'
      }
    },
    getActiveTab: function() {},
    constructor: function(config) {
      this.initConfig(arguments);
      return this.callParent(arguments);
    },
    initComponent: function() {
      var me;
      me = this;
      Ext.apply(this, {
        collapsible: false,
        floatable: false
      });
      return this.callParent(arguments);
    }
  });
}).call(this);
