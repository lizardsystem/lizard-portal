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
    onLayerClick: function(view, record, item, index, event, eOpts) {
      if (record.dirty === true) {
        if (record.get('checked')) {
          this.workspaceItemStore.createWorkspaceItem();
        } else {
          this.workspaceItemStore.deleteWorkspaceItem();
        }
        this.workspaceItemStore.sync();
        return record.commit();
      }
    },
    initComponent: function() {
      var me;
      me = this;
      Ext.apply(this, {
        listeners: {
          itemclick: this.onLayerClick
        }
      });
      return this.callParent(arguments);
    },
    afterRender: function() {
      this.callParent(arguments);
      return this.store.load({
        params: {
          object_id: this.layerFolderId
        }
      });
    }
  });

}).call(this);
