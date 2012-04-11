(function() {

  Ext.define('Lizard.portlet.MultiImagePortlet', {
    extend: 'Lizard.portlet.Portlet',
    alias: 'widget.multiimageportlet',
    layout: {
      type: 'vboxscroll',
      align: 'stretch'
    },
    autoScroll: true,
    initComponent: function() {
      var me;
      me = this;
      Ext.apply(this, {
        items: {
          xtype: 'dataview',
          store: this.store,
          tpl: new Ext.XTemplate('<tpl for=".">', '<div class="thumb-wrap">', '<span>{name}</span><br />', '<img src="{base_url}" />', '</div>', '</tpl>'),
          itemSelector: 'div.thumb-wrap'
        }
      });
      return this.callParent(arguments);
    }
  });

}).call(this);
