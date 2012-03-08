(function() {

  Ext.define('Lizard.store.WorkspaceItemStore', {
    extend: 'GeoExt.data.LayerStore',
    alias: 'store.workspaceitemstore',
    model: 'Lizard.model.WorkspaceItemModel',
    data: [new OpenLayers.Layer.OSM('Openstreetmap')],
    createWorkspaceItem: function(config) {
      var record, workspace_item;
      record = this.getById(config.plid);
      if (record) {
        return console.log('Warning: record already added');
      } else {
        config.id = config.plid;
        config.clickable = true;
        config.visible = true;
        workspace_item = Ext.create('Lizard.model.WorkspaceItemModel', config);
        workspace_item.set('visibility', true);
        workspace_item.set('visible', true);
        return this.add(workspace_item);
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
