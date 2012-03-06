(function() {

  Ext.define('Lizard.portlet.AppScreenPortlet', {
    extend: 'Ext.view.View',
    alias: 'widget.appscreenportlet',
    layout: {
      type: 'vboxscroll',
      align: 'stretch'
    },
    defaults: {
      flex: 1,
      height: 250
    },
    autoScroll: true,
    tpl: new Ext.XTemplate('<tpl for=".">', '<div class="app_icon" >', '<img src="{icon}" ', 'id="app-{slug}" />', '<div>{name}</div>', '</div>', '</tpl>'),
    itemSelector: 'div.app_icon',
    onAppClick: function(view, record) {
      var action_type, app, tab, tabpanel;
      tabpanel = this.up('tabpanel');
      tab = tabpanel.child('#app' + record.get('slug'));
      if (tab) {
        return tabpanel.setActiveTab(tab);
      } else {
        action_type = record.get('action_type');
        if (action_type === 10) {
          return this.store.load({
            params: {
              object_id: record.get('target_app_slug')
            }
          });
        } else if (action_type === 20) {
          app = Ext.create('Lizard.portlet.AvailableLayersPortlet', {
            store: Ext.create('Lizard.store.AvailableLayersStore', {
              id: 'appst' + record.get('slug')
            }),
            root_map_slug: record.get('action_params').root_map,
            title: record.get('name'),
            id: 'app' + record.get('slug')
          });
          tab = tabpanel.add(app);
          return tabpanel.setActiveTab(tab);
        } else {
          return alert('actiontype not yet supported: ' + action_type);
        }
      }
    },
    initComponent: function() {
      var me;
      me = this;
      Ext.apply(this, {
        listeners: {
          itemclick: this.onAppClick
        }
      });
      return this.callParent(arguments);
    },
    afterRender: function() {
      this.callParent(arguments);
      return this.store.load({
        params: {
          object_id: this.start_appscreen_slug
        }
      });
    }
  });

}).call(this);
