(function() {
  Ext.define('Lizard.portlet.AppPortlet', {
    extend: 'Lizard.portlet.Portlet',
    alias: 'widget.appportlet',
    config: {
      default_graph_service_url: '',
      store: null,
      useGraphButtonBar: true,
      fitInPortal: true
    },
    bodyStyle: {
      'padding-right': '20px'
    },
    itemSelector: 'div.thumb-wrap',
    emptyText: 'No graphs available',
    constructor: function(config) {
      this.initConfig(arguments);
      return this.callParent(arguments);
    },
    initComponent: function() {
      var me;
      me = this;
      Ext.apply(this, {
        layout: {
          type: 'vboxscroll',
          align: 'stretch'
        },
        autoScroll: true,
        items: {
          xtype: 'dataview',
          store: this.store,
          tpl: new Ext.XTemplate('<tpl if="this.context_ready()">', '<tpl for=".">', '<div class="thumb-wrap">', '<tpl if="visible">', '{name}:   ', '<tpl if="detail_link">', '<a href="javascript:Ext.getCmp(\'portalWindow\').linkTo({portalTemplate:\'{detail_link}\'})">details</a>', '</tpl>', '<img src="', '{[this.get_url(values)]}', '" height={height} width={width} />', '</tpl>', '</div>', '</tpl>', '</tpl>', {
            get_url: function(values) {
              return Lizard.model.Graph.getGraphUrl(values);
            },
            context_ready: function() {
              return me.store.context_ready;
            }
          }),
          itemSelector: this.itemSelector,
          emptyText: this.emptyText
        },
        listeners: {
          resize: function() {
            return console.log('test');
          }
        }
      });
      return this.callParent(arguments);
    }
  });
}).call(this);
