(function() {
  Ext.Loader.setPath('Lizard', '/static_media/lizard_portal/lizard');
  Ext.Loader.setPath('Vss', '/static_media/lizard_portal/vss');
  Ext.Loader.setPath('GeoExt', '/static_media/geoext4/src');
  Ext.application({
    name: 'lizardViewer',
    models: ['Vss.model.Communique', 'Vss.model.Esf', 'Vss.model.ObjectTree'],
    stores: ['Vss.store.Communique', 'Vss.store.Esf', 'Vss.store.CatchmentTree', 'Vss.store.KrwGebiedenTree'],
    requires: ['Lizard.plugin.ApplyContext', 'Ext.Img', 'Ext.grid.*', 'Ext.grid.plugin.*', 'Ext.data.Model', 'Ext.data.*', 'Ext.tree.*', 'Ext.button.*', 'Lizard.ux.CheckColumn', 'Lizard.ux.CheckColumnTree', 'Lizard.ux.VBoxScroll', 'Lizard.ux.ImageResize', 'GeoExt.panel.Map', 'GeoExt.data.LayerStore', 'GeoExt.data.LayerModel', 'GeoExt.data.reader.Layer', 'Ext.MessageBox', 'Lizard.portlet.Portlet', 'Lizard.portlet.PortalPanel', 'Lizard.portlet.PortalColumn', 'Lizard.portlet.GridPortlet', 'Lizard.portlet.MultiGraph', 'Vss.grid.Esf'],
    launch: function() {
      OpenLayers.ImgPath = "/static_media/themes/dark/";
      Ext.create(GeoExt.data.LayerStore, {
        layers: [
          new OpenLayers.Layer.OSM(), new OpenLayers.Layer.WMS('Waterlopen', 'http://maps.waterschapservices.nl/wms?namespace=inspire', {
            layers: ['HY.PhysicalWaters.Waterbodies'],
            transparent: "true",
            format: "image/png"
          }, {
            singleTile: true,
            displayOutsideMaxExtent: true,
            projection: new OpenLayers.Projection("EPSG:900913")
          }), new OpenLayers.Layer.WMS('Kunstwerken', 'http://maps.waterschapservices.nl/wms?namespace=inspire', {
            layers: ['HY.PhysicalWaters.ManMadeObject'],
            transparent: "true",
            format: "image/png"
          }, {
            singleTile: true,
            displayOutsideMaxExtent: true,
            projection: new OpenLayers.Projection("EPSG:900913")
          })
        ],
        storeId: 'Layers'
      });
      return Ext.create('Lizard.window.Dashboard');
    }
  });
}).call(this);
