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
      var rec;
      if (record.dirty === true) {
        if (record.get('checked')) {
          rec = record.raw;
          rec.title = rec.text;
          this.workspaceItemStore.createWorkspaceItem(record.raw);
        } else {
          this.workspaceItemStore.deleteWorkspaceItem(record.raw);
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
      this.store.load({
        params: {
          object_id: this.layerFolderId
        }
      });
      if (this.workspaceItemStore) return this.store.bind(this.workspaceItemStore);
    }
  });

}).call(this);
