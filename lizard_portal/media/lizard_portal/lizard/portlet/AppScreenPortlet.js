(function() {
  Ext.define('Lizard.portlet.AppScreenPortlet', {
    extend: 'Lizard.portlet.Portlet',
    alias: 'widget.appscreenportlet',
    initComponent: function() {
      var me;
      me = this;
      console.log('Jack Init portlet');
      Ext.apply(this, {
        layout: {
          type: 'vboxscroll',
          align: 'stretch'
        },
        defaults: {
          flex: 1,
          height: 250
        },
        autoScroll: true,
        items: {
          xtype: 'dataview',
          store: this.store,
          tpl: new Ext.XTemplate('<tpl for=".">', '<li class="app_icon draggable"><a href="{url}" title="{description}">', '<img src="/static_media/lizard_portal/app_icons/metingen.png" ', 'id="app-{slug}" />', '<div>{name} ({type})</div>', '</a></li>', '</tpl>')
        }
      });
      return this.callParent(arguments);
    }
  });
}).call(this);
