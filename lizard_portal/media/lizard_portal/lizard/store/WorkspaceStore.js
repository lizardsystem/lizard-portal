
Ext.define('Lizard.store.WorkspaceStore', {
  "extends": 'GeoExt.data.LayerStore',
  storeId: 'WorkspaceStore',
  layers: [
    new OpenLayers.Layer.OSM('Openstreetmap'), new OpenLayers.Layer.WMS('Aan-afvoergebieden', 'http://maps.waterschapservices.nl/inspire/wms?namespace=inspire', {
      layers: ['inspire:HY.PhysicalWaters.Catchments'],
      transparent: "true",
      format: "image/png"
    }, {
      singleTile: false,
      displayOutsideMaxExtent: true,
      projection: new OpenLayers.Projection("EPSG:900913"),
      visibility: false
    }), new OpenLayers.Layer.WMS('Peilgebieden', 'http://maps.waterschapservices.nl/wsh/wms?', {
      layers: ['wsh:peilgebied'],
      transparent: "true",
      format: "image/png"
    }, {
      singleTile: false,
      displayOutsideMaxExtent: true,
      projection: new OpenLayers.Projection("EPSG:900913")
    }), new OpenLayers.Layer.WMS('Waterschapsgrenzen', 'http://maps.waterschapservices.nl/inspire/wms?namespace=inspire', {
      layers: ['inspire:AU.AdministrativeUnit'],
      transparent: "true",
      format: "image/png"
    }, {
      singleTile: false,
      displayOutsideMaxExtent: true,
      projection: new OpenLayers.Projection("EPSG:900913"),
      visibility: false,
      opacity: 0.5
    })
  ]
});
