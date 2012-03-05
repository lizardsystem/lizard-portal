(function() {

  Ext.define('Lizard.portlet.AvailableLayersPortlet', {
    extend: 'Lizard.portlet.Portlet',
    alias: 'widget.availablelayersportlet',
    autoHeight: true,
    minHeight: 200,
    title: 'Beschikbare kaarten',
    store: Ext.data.StoreManager.lookup('Workspace'),
    items: [
      {
        xtype: 'tabpanel',
        tabPosition: 'bottom',
        items: [
          {
            title: 'Browse',
            xtype: 'dataview',
            store: this.store,
            id: 'browser',
            tpl: new Ext.XTemplate('<tpl for=".">', '<div class="app_icon draggable"><a href="{url}" title="{description}">', '<img src="/static_media/lizard_portal/app_icons/metingen.png" ', 'id="app-{slug}" />', '<div>{name} ({type})</div>', '</a></div>', '</tpl>'),
            itemSelector: 'div.apps-source',
            renderTo: Ext.getBody()
          }, {
            title: 'Layers',
            xtype: 'treepanel',
            id: 'layersTree',
            store: Ext.create('Ext.data.TreeStore', {
              root: {
                text: 'Title',
                expanded: true,
                id: 'root-id'
              },
              autoLoad: true,
              proxy: {
                type: 'ajax',
                url: '/workspace/api/layer_view/',
                reader: {
                  type: 'json',
                  root: 'data'
                }
              }
            })
          }
        ]
      }
    ],
    initComponent: function() {
      var me;
      me = this;
      return this.callParent(arguments);
    }
  });

}).call(this);
