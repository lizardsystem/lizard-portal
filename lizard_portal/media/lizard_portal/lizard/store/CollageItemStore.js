(function() {

  Ext.define('Lizard.store.CollageItemStore', {
    extend: 'GeoExt.data.LayerStore',
    alias: 'store.collageitemstore',
    storeId: 'CollageStore',
    model: 'Lizard.model.CollageItemModel',
    createCollageItem: function(config, index) {
      var collage_item;
      if (index == null) index = null;
      collage_item = this.getById(config.plid);
      if (collage_item) {
        console.log('Warning: collage_item already added');
        return collage_item;
      } else {
        collage_item = Ext.create('Lizard.model.CollageItemModel', config);
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
