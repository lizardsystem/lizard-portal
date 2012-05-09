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
      var action_type, app, pos, tab, tabpanel;
      tabpanel = this.up('tabpanel');
      tab = tabpanel.child('#app' + record.get('slug'));
      if (tab) {} else {
        action_type = record.get('action_type');
        if (action_type === 10) {
          alert('actiontype not yet supported: ' + action_type);
          return;
        } else if (action_type === 20) {
          app = Ext.create('Lizard.portlet.AvailableLayersPortlet', {
            store: Ext.create('Lizard.store.AvailableLayersStore', {
              id: 'appst' + record.get('slug')
            }),
            layerFolderId: record.get('action_params').root_map,
            title: record.get('name'),
            id: 'app' + record.get('slug'),
            workspaceStore: this.workspaceStore
          });
          tab = tabpanel.add(app);
          pos = tabpanel.tabBar.items.indexOf(tab.tab);
          if (pos > 0) tabpanel.tabBar.move(pos, 1);
          tabpanel.setActiveTab(tab);
        } else {
          alert('actiontype not yet supported: ' + action_type);
          return;
        }
      }
      pos = tabpanel.tabBar.items.indexOf(tab.tab);
      if (pos > 0) tabpanel.tabBar.move(pos, 1);
      return tabpanel.setActiveTab(tab);
    },
    initComponent: function() {
      var me;
      me = this;
      Ext.apply(this, {
        listeners: {
          itemclick: this.onAppClick
        }
      });
      if (!this.workspaceStore) {
        this.workspaceStore = Ext.create(Lizard.store.WorkspaceStore, {
          layerStore: this.workspaceItemStore
        });
      }
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
