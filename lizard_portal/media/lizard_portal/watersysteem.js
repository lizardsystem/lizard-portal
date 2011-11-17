(function() {
  Ext.Loader.setPath('Lizard', '/static_media/lizard_portal/lizard');
  Ext.Loader.setPath('Vss', '/static_media/lizard_portal/vss');
  Ext.Loader.setPath('GeoExt', '/static_media/geoext4/src');
  Ext.application({
    name: 'lizardViewer',
    models: ['Vss.model.Communique', 'Vss.model.Esf', 'Vss.model.ObjectTree', 'Vss.model.PropertyGrid', 'Vss.model.WaterbalanceBucket', 'Vss.model.WaterbalanceStructure', 'Vss.model.AnnotationDetail', 'Vss.model.AnnotationDescription', 'Vss.model.TimeserieObject'],
    stores: ['Vss.store.Communique', 'Vss.store.Esf', 'Vss.store.CatchmentTree', 'Vss.store.KrwGebiedenTree', 'Vss.store.WaterbalanceAreaConfig', 'Vss.store.WaterbalanceBucket', 'Vss.store.WaterbalanceStructure', 'Vss.store.WaterbalanceWaterConfig', 'Vss.store.AnnotationDetail', 'Vss.store.AnnotationDescription', 'Vss.store.TimeserieObject'],
    requires: ['Lizard.plugin.ApplyContext', 'Ext.Img', 'Ext.grid.*', 'Ext.grid.plugin.*', 'Ext.data.Model', 'Ext.data.StoreManager', 'Ext.data.*', 'Ext.tree.*', 'Ext.form.*', 'Ext.button.*', 'Lizard.ux.CheckColumn', 'Lizard.ux.CheckColumnTree', 'Lizard.ux.VBoxScroll', 'Lizard.ux.ImageResize', 'GeoExt.panel.Map', 'GeoExt.data.LayerStore', 'GeoExt.data.LayerModel', 'GeoExt.data.reader.Layer', 'Ext.MessageBox', 'Lizard.grid.EditablePropertyGrid', 'Lizard.portlet.Portlet', 'Lizard.portlet.PortalPanel', 'Lizard.portlet.PortalColumn', 'Lizard.portlet.GridPortlet', 'Lizard.portlet.MultiGraph', 'Vss.grid.Esf'],
    launch: function() {
      var settings;
      Ext.create(GeoExt.data.LayerStore, {
        layers: [
          new OpenLayers.Layer.OSM('Openstreetmap'), new OpenLayers.Layer.WMS('BRT achtergrond', 'http://geodata.nationaalgeoregister.nl/wmsc', {
            layers: ['brtachtergrondkaart'],
            transparent: "true",
            format: "image/png"
          }, {
            singleTile: false,
            displayOutsideMaxExtent: true,
            projection: new OpenLayers.Projection("EPSG:900913"),
            visibility: false
          }), new OpenLayers.Layer.WMS('Waterlopen', 'http://maps.waterschapservices.nl/wms?namespace=inspire', {
            layers: ['HY.PhysicalWaters.Waterbodies'],
            transparent: "true",
            format: "image/png"
          }, {
            singleTile: false,
            displayOutsideMaxExtent: true,
            projection: new OpenLayers.Projection("EPSG:900913")
          }), new OpenLayers.Layer.WMS('Gemalen', 'http://maps.waterschapservices.nl/inspire/wms?namespace=inspire', {
            layers: ['inspire:HY.PhysicalWaters.ManMadeObject.DamOrWeir.Gemaal'],
            transparent: "true",
            format: "image/png"
          }, {
            singleTile: false,
            displayOutsideMaxExtent: true,
            projection: new OpenLayers.Projection("EPSG:900913")
          }), new OpenLayers.Layer.WMS('Stuwen', 'http://maps.waterschapservices.nl/inspire/wms?namespace=inspire', {
            layers: ['inspire:HY.PhysicalWaters.ManMadeObject.DamOrWeir.Stuw'],
            transparent: "true",
            format: "image/png"
          }, {
            singleTile: false,
            displayOutsideMaxExtent: true,
            projection: new OpenLayers.Projection("EPSG:900913")
          }), new OpenLayers.Layer.WMS('Duikers', 'http://maps.waterschapservices.nl/inspire/wms?namespace=inspire', {
            layers: ['inspire:HY.PhysicalWaters.ManMadeObject.Crossing.Duiker'],
            transparent: "true",
            format: "image/png"
          }, {
            singleTile: false,
            displayOutsideMaxExtent: true,
            projection: new OpenLayers.Projection("EPSG:900913"),
            visibility: false
          }), new OpenLayers.Layer.WMS('Aan-afvoergebieden', 'http://maps.waterschapservices.nl/inspire/wms?namespace=inspire', {
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
          }), new OpenLayers.Layer.WMS('Bruggen', 'http://maps.waterschapservices.nl/inspire/wms?namespace=inspire', {
            layers: ['HY.Bridge'],
            transparent: "true",
            format: "image/png"
          }, {
            singleTile: false,
            displayOutsideMaxExtent: true,
            projection: new OpenLayers.Projection("EPSG:900913"),
            visibility: false
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
        ],
        storeId: 'Layers'
      });
      settings = {
        area_selection_template: 'aan_afvoergebied_selectie',
        area_store: 'Vss.store.CatchmentTree',
        lizard_context: {
          period_start: '2000-01-01T00:00',
          period_end: '2002-01-01T00:00',
          object: 'aan_afvoergebied',
          object_id: null,
          portalTemplate: 'homepage',
          base_url: 'portal/watersysteem'
        }
      };
      return Ext.create('Lizard.window.Dashboard', settings);
    }
  });
}).call(this);
