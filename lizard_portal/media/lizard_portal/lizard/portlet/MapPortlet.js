(function() {

  Ext.define('Lizard.portlet.MapPortlet', {
    extend: 'GeoExt.panel.Map',
    alias: 'widget.mapportlet',
    title: 'Map',
    tbar: [
      {
        xtype: 'button',
        text: 'test'
      }, '->', {
        fieldLabel: 'Achtergrondkaart',
        name: 'base_layer',
        displayField: 'name',
        valueField: 'id',
        xtype: 'combo',
        queryMode: 'remote',
        typeAhead: false,
        minChars: 0,
        forceSelection: true,
        width: 200,
        store: {
          fields: ['id', 'name'],
          proxy: {
            type: 'ajax',
            url: '/measure/api/organization/?_accept=application%2Fjson&size=id_name',
            reader: {
              type: 'json',
              root: 'data'
            }
          }
        }
      }
    ],
    onMapClickCallback: function(records, event, lonlat, xhr, request) {
      return alert(records[0].data);
    },
    onMapClick: function(event, lonlat, callback) {
      var layer, me, params, url;
      me = this;
      debugger;
      layer = this.layers.findRecord('clickable', true);
      if (!layer) {
        alert('geen kaartlaag geselecteerd');
        return;
      }
      params = {
        REQUEST: "GetFeatureInfo",
        EXCEPTIONS: "application/vnd.ogc.se_xml",
        BBOX: this.map.getExtent().toBBOX(),
        X: event.xy.x,
        Y: event.xy.y,
        INFO_FORMAT: 'application/vnd.ogc.gml',
        QUERY_LAYERS: layer.layers,
        LAYERS: layer.layers,
        FEATURE_COUNT: 1,
        WIDTH: this.map.size.w,
        HEIGHT: this.map.size.h,
        SRS: this.map.projection.projCode
      };
      if (layer.get('url').contains('http')) {
        url = layer.get('layer').getFullRequestString(params, layer.get('url'));
        return Ext.Ajax.request({
          url: '/portal/getFeatureInfo/',
          reader: {
            type: 'xml'
          },
          params: {
            request: Ext.JSON.encode(params)
          },
          method: 'GET',
          success: function(xhr, request) {
            var format, gml, gml_text;
            gml_text = xhr.responseText;
            format = new OpenLayers.Format.GML.v3();
            gml = format.read(gml_text);
            return me.onMapClickCallback(gml, event, lonlat, xhr, request);
          },
          failure: function(xhr) {
            return alert('failure');
          }
        });
      } else {
        return Ext.Ajax.request({
          url: layer.get('url'),
          reader: {
            type: 'xml'
          },
          params: params,
          method: 'GET',
          success: function(xhr, request) {
            var format, gml, gml_text;
            gml_text = xhr.responseText;
            format = new OpenLayers.Format.GML.v3();
            gml = format.read(gml_text);
            return me.onMapClickCallback(gml, event, lonlat, xhr, request);
          },
          failure: function(xhr) {
            return alert('failure');
          }
        });
      }
    },
    initComponent: function() {
      var me;
      me = this;
      return this.callParent(arguments);
    }
  });

}).call(this);
