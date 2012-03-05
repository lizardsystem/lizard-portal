(function() {
  Ext.define('Lizard.store.LayerStore', {
    extend: 'GeoExt.data.LayerStore',
    alias: 'store.layerstore',
    model: 'Lizard.model.LayerModel',
    data: [new OpenLayers.Layer.OSM('Openstreetmap')]
  });
}).call(this);
