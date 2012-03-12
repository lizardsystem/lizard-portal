(function() {

  Ext.define('Lizard.store.CollageItemStore', {
    extend: 'GeoExt.data.LayerStore',
    alias: 'store.collageitemstore',
    model: 'Lizard.model.CollageItemModel',
    data: [new OpenLayers.Layer.OSM('Openstreetmap')],
    createWorkspaceItem: function(config, index) {
      var collage_item, record;
      if (index == null) index = null;
      record = this.getById(config.plid);
      if (record) {
        console.log('Warning: record already added');
        return record;
      } else {
        if (config.plid) config.id = config.plid;
        config.clickable = true;
        config.visible = true;
        collage_item = Ext.create('Lizard.model.CollageItemModel', config);
        collage_item.set('visibility', true);
        collage_item.set('visible', true);
        if (index === !null) {
          this.insert(index, collage_item);
        } else {
          this.add(collage_item);
        }
        return collage_item;
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
