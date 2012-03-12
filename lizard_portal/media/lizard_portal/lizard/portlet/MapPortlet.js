(function() {

  Ext.define('Lizard.portlet.MapPortlet', {
    extend: 'GeoExt.panel.Map',
    default_zoom: null,
    alias: 'widget.mapportlet',
    title: 'Map',
    plugins: ['applycontext'],
    autoLoadWorkspaceStore: null,
    tbar: [
      {
        xtype: 'button',
        text: 'Zoom gebied',
        handler: function(button, event) {
          var panel;
          panel = button.up('panel');
          return panel.map.zoomToExtent(new OpenLayers.Bounds.fromArray(panel.default_zoom));
        }
      }, '->', {
        xtype: 'button',
        text: 'achtergrond',
        handler: function(button, event) {
          var background, config, index, panel;
          config = {};
          panel = button.up('panel');
          index = panel.layers.find('is_base_layer', true);
          if (index >= 0) {
            background = panel.layers.getAt(index);
            config.init_background_id = background.get('id');
          }
          return Lizard.form.BackgroundLayerSelector.show(config);
        }
      }
    ],
    applyParams: function(params) {
      var me;
      me = this;
      if (params.background_layer) {
        this.setBackgroundLayer(params.background_layer);
      }
      if (params.object) {
        this.layers.each(function(record) {
          var filter, layer, request_params, tpl, value;
          if (record.get('use_location_filter') === true) {
            layer = record.getLayer();
            filter = Ext.JSON.decode(record.get('location_filter'));
            if (filter.tpl) {
              tpl = new Ext.Template(filter.tpl);
              value = tpl.apply(params.object);
            } else {
              value = params.object.id;
            }
            request_params = {};
            request_params[filter.key] = value;
            return layer.mergeNewParams(request_params);
          }
        });
      }
      return this.onApplyParams(params);
    },
    onApplyParams: Ext.emptyFn,
    setBackgroundLayer: function(config) {
      var existing_background_layers, item, me;
      me = this;
      if (config && this.background_layer_id) {
        if (config.plid === this.background_layer_id) return;
      }
      existing_background_layers = this.layers.queryBy(function(record, id) {
        if (record.get('is_base_layer') === true) {
          return true;
        } else {

        }
      });
      item = this.layers.createWorkspaceItem(config, 0);
      this.background_layer_id = config.plid;
      this.background_layer = config;
      this.map.setBaseLayer(item.getLayer());
      return existing_background_layers.each(function(background_layer) {
        return me.layers.remove(background_layer);
      });
    },
    onMapClickCallback: function(records, workspaceitem, event, lonlat, xhr, request) {
      var data, dt_end, dt_start, html, record, tpl;
      if (records.length > 0) {
        if (records[0].data.par_ident) {
          dt_start = Ext.Date.format(Lizard.CM.getContext().period.start, 'Y-m-d H:i:s');
          dt_end = Ext.Date.format(Lizard.CM.getContext().period.end, 'Y-m-d H:i:s');
          record = records[0];
          return Ext.create('Ext.window.Window', {
            title: 'locatie',
            modal: true,
            xtype: 'leditgrid',
            itemId: 'map popup',
            finish_edit_function: function(updated_record) {},
            editpopup: true,
            items: [
              {
                xtype: 'panel',
                width: 1050,
                height: 550,
                html: 'Grafiek voor ' + record.data.geo_ident + ' ' + record.data.par_ident + ' ' + record.data.mod_ident + ' ' + record.data.stp_ident + '<img src="/graph/?dt_start=' + dt_start + '&dt_end=' + dt_end + '&width=1000&height=500&item={%22fews_norm_source_slug%22:%22waternet%22,%22location%22:%22' + record.data.geo_ident + '%22,%22parameter%22:%22' + record.data.par_ident + '%22,%22type%22:%22line%22,%22time_step%22:%22' + record.data.stp_ident + '%22,%22module%22:%22' + record.data.mod_ident + '%22}" />',
                tbar: [
                  {
                    text: 'Voeg toe aan collage',
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
          record = records[0];
          data = [];
          Ext.Object.each(record.data, function(key, value) {
            return data.push({
              key: key,
              value: value
            });
          });
          tpl = new Ext.XTemplate('<div class="lizard">', '<h2>Kaartlaag: {layer_name}</h2>', '<table>', '<tpl for="fields">', '<tr><td>{key}</td><td>{value}</td></tr>', '</tpl></table></div>');
          html = tpl.applyTemplate({
            layer_name: workspaceitem.get('title'),
            fields: data
          });
          return Ext.create('Ext.window.Window', {
            title: 'Info',
            popup_type: 'feature_info',
            items: [
              {
                xtype: 'panel',
                width: 400,
                html: html
              }
            ]
          }).show();
        }
      } else {
        return alert('nothing found');
      }
    },
    onMapClick: function(event, lonlat, callback) {
      var layer, me, params, url;
      me = this;
      layer = this.layers.findRecord('clickable', true);
      if (!layer) {
        Ext.Msg.alert('', 'geen kaartlaag geselecteerd');
        return;
      }
      params = {
        REQUEST: "GetFeatureInfo",
        EXCEPTIONS: "application/vnd.ogc.se_xml",
        BBOX: this.map.getExtent().toBBOX(),
        X: Math.round(event.xy.x),
        Y: Math.round(event.xy.y),
        INFO_FORMAT: 'application/vnd.ogc.gml',
        QUERY_LAYERS: layer.get('layers'),
        LAYERS: layer.get('layers'),
        FEATURE_COUNT: 2,
        WIDTH: this.map.size.w,
        HEIGHT: this.map.size.h,
        SRS: "EPSG:900913"
      };
      if (layer.get('url') === '') {
        alert('Test: Selecteer een andere kaartlaag als bovenste clickable');
      } else if (!layer.get('is_local_server')) {
        url = layer.get('layer').getFullRequestString(params, layer.get('url'));
        return Ext.Ajax.request({
          url: '/portal/getFeatureInfo/',
          reader: {
            type: 'xml'
          },
          params: {
            request: Ext.JSON.encode(url)
          },
          method: 'GET',
          success: function(xhr, request) {
            var format, gml, gml_text;
            gml_text = xhr.responseText;
            format = new OpenLayers.Format.GML.v3();
            gml = format.read(gml_text);
            if (gml.length > 0) {
              return me.onMapClickCallback(gml, layer, event, lonlat, xhr, request);
            } else {
              return alert('Niks gevonden debug: ' + gml_text);
            }
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
            if (gml.length > 0) {
              return me.onMapClickCallback(gml, layer, event, lonlat, xhr, request);
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
      this.layers = this.workspaceStore.workspaceItemStore;
      return this.callParent(arguments);
    },
    afterRender: function() {
      return this.callParent(arguments);
    }
  });

}).call(this);
