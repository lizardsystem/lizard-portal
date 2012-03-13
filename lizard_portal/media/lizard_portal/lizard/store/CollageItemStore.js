(function() {

  Ext.define('Lizard.store.CollageItemStore', {
    extend: 'GeoExt.data.LayerStore',
    alias: 'store.collageitemstore',
    model: 'Lizard.model.CollageItemModel',
    data: [new OpenLayers.Layer.OSM('Openstreetmap')],
    createCollageItem: function(config, index) {
      var collage_item;
      if (index == null) index = null;
      collage_item = this.getById(config.plid);
      if (collage_item) {
        console.log('Warning: collage_item already added');
        return collage_item;
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
    deleteCollageItem: function(config) {
      var record;
      record = this.getById(config.plid);
      if (record) {
        return this.remove(record);
      } else {
        return console.log('Warning: collage_item already removed');
      }
    }
  });

}).call(this);
