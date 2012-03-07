(function() {

  Ext.define('Lizard.store.WorkspaceItemStore', {
    extend: 'GeoExt.data.LayerStore',
    alias: 'store.workspaceitemstore',
    model: 'Lizard.model.WorkspaceItemModel',
    data: [new OpenLayers.Layer.OSM('Openstreetmap'), new OpenLayers.Layer.OSM('Openstreetmap')],
    createWorkspaceItem: function() {
      var workspace_item;
      workspace_item = Ext.create('Lizard.model.WorkspaceItemModel', {
        ollayer_class: 'OpenLayers.Layer.OSM',
        name: 'just added',
        id: 5,
        order: 100,
        clickable: true
      });
      return this.add(workspace_item);
    },
    deleteWorkspaceItem: function() {
      return alert('deleting workspace item');
    }
  });

}).call(this);
