(function() {

  Ext.define('Lizard.store.WorkspaceItemStore', {
    extend: 'GeoExt.data.LayerStore',
    alias: 'store.workspaceitemstore',
    model: 'Lizard.model.WorkspaceItemModel',
    data: [new OpenLayers.Layer.OSM('Openstreetmap')],
    createWorkspaceItem: function(config, index) {
      var record, workspace_item;
      if (index == null) index = null;
      record = this.getById(config.plid);
      if (record) {
        console.log('Warning: record already added');
        return record;
      } else {
        if (config.plid) config.id = config.plid;
        config.clickable = true;
        config.visible = true;
        workspace_item = Ext.create('Lizard.model.WorkspaceItemModel', config);
        workspace_item.set('visibility', true);
        workspace_item.set('visible', true);
        if (index === !null) {
          this.insert(index, workspace_item);
        } else {
          this.add(workspace_item);
        }
        return workspace_item;
      }
    },
    deleteWorkspaceItem: function(config) {
      var record;
      record = this.getById(config.plid);
      if (record) {
        return this.remove(record);
      } else {
        return console.log('Warning: record already removed');
      }
    }
  });

}).call(this);
