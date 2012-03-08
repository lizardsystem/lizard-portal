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
      var record;
      if (records.length > 0) {
        record = records[0];
        return Ext.create('Ext.window.Window', {
          title: 'locatie',
          modal: true,
          xtype: 'leditgrid',
          itemId: 'map popup',
          finish_edit_function: function(updated_record) {
            debugger;
          },
          editpopup: true,
          items: [
            {
              xtype: 'panel',
              width: 1050,
              height: 550,
              html: 'Grafiek voor ' + record.data.geo_ident + '<img src="/graph/?dt_start=2001-01-01%2000:00:00&dt_end=2011-01-01%2000:00:00&width=1000&height=500&item={%22fews_norm_source_slug%22:%22waternet%22,%22location%22:%22' + record.data.geo_ident + '%22,%22parameter%22:%22' + record.data.par_ident + '%22,%22type%22:%22line%22,%22time_step%22:%22' + record.data.stp_ident + '%22}" />',
              bbar: [
                {
                  text: 'Okee dan',
                  handler: function(btn, event) {
                    var window;
                    window = this.up('window');
                    return window.close();
                  }
                }
              ]
            }
          ]
        }).show();
      } else {
        return alert('nothing found');
      }
    },
    onMapClick: function(event, lonlat, callback) {
      var layer, me, params;
      me = this;
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
        QUERY_LAYERS: event.object.layers[1].params.LAYERS,
        LAYERS: event.object.layers[1].params.LAYERS,
        FEATURE_COUNT: 1,
        WIDTH: this.map.size.w,
        HEIGHT: this.map.size.h,
        SRS: 'EPSG:900913'
      };
      if (layer.get('url') === '') {
        alert('Test: Selecteer een andere kaartlaag als bovenste clickable');
        return;
      }
      if (true) {
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
            if (gml.length > 0) {
              return me.onMapClickCallback(gml, event, lonlat, xhr, request);
            } else {
              return alert('Niks gevonden debug: ' + gml_text);
            }
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
