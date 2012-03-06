(function() {
  Ext.define('Lizard.portlet.AvailableLayersPortlet', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.availablelayersportlet',
    minHeight: 200,
    title: 'Beschikbare kaarten',
    root_map_slug: null,
    title: 'Layers',
    rootVisible: false,
    autoLoad: false,
    initComponent: function() {
      var me;
      me = this;
      return this.callParent(arguments);
    },
    afterRender: function() {
      debugger;      this.callParent(arguments);
      return this.store.load({
        params: {
          object_id: this.root_map_slug
        }
      });
    }
  });
}).call(this);
