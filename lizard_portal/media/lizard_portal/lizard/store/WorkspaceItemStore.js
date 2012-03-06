(function() {

  Ext.define('Lizard.store.WorkspaceItemStore', {
    extend: 'GeoExt.data.LayerStore',
    alias: 'store.workspaceitemstore',
    model: 'Lizard.model.WorkspaceItemModel',
    data: [new OpenLayers.Layer.OSM('Openstreetmap')],
    createWorkspaceItem: function() {
      return alert('creating workspace item');
    },
    deleteWorkspaceItem: function() {
      return alert('deleting workspace item');
    }
  });

}).call(this);
