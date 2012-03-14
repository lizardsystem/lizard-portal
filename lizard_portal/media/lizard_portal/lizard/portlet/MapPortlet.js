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
      item = this.layers.createWorkspaceItem(config, -1);
      this.background_layer_id = config.plid;
      this.background_layer = config;
      this.map.setBaseLayer(item.getLayer());
      return existing_background_layers.each(function(background_layer) {
        return me.layers.remove(background_layer);
      });
    },
    onMapClickCallback: function(records, workspaceitem, event, lonlat, xhr, request) {
      var popup_class, popup_class_name;
      if (records.length > 0) {
        popup_class_name = 'Lizard.popup.' + workspaceitem.get('js_popup_class');
        popup_class = Ext.ClassManager.get(popup_class_name);
        if (!popup_class) {
          popup_class = Ext.ClassManager.get('Lizard.popup.FeatureInfo');
          console.error("Cannot find popup class " + popup_class_name);
        }
        return popup_class.show(records, workspaceitem);
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
        return alert('Test: Selecteer een andere kaartlaag als bovenste clickable');
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
