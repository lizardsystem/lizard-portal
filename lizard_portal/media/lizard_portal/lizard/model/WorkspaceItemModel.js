(function() {

  Ext.define('Lizard.model.WorkspaceItemModel', {
    extend: 'Ext.data.Model',
    fields: [
      {
        name: "id",
        type: "number"
      }, {
        name: "layer",
        persist: false
      }, {
        name: "name",
        type: "string",
        mapping: "name"
      }, {
        name: "order",
        type: "number",
        mapping: "order"
      }, {
        name: "visibility",
        type: "boolean",
        defaultValue: true,
        mapping: "visibility"
      }, {
        name: "clickable",
        type: "boolean",
        defaultValue: true,
        mapping: "clickable"
      }, {
        name: "opacity",
        type: "number",
        defaultValue: 0,
        mapping: "opacity"
      }, {
        name: "use_location_filter",
        type: "boolean",
        mapping: "use_location_filter",
        persist: false
      }, {
        name: "location_filter",
        type: "string",
        mapping: "location_filter",
        persist: false
      }, {
        name: "ollayer_class",
        type: "string",
        mapping: "ollayer_class",
        persist: false
      }, {
        name: "url",
        type: "string",
        mapping: "url",
        persist: false
      }, {
        name: "layers",
        type: "string",
        mapping: "layers",
        persist: false
      }, {
        name: "filter",
        type: "string",
        mapping: "filter",
        persist: false
      }, {
        name: "request_params",
        type: "string",
        mapping: "request_params",
        persist: false
      }, {
        name: "is_base_layer",
        type: "boolean",
        mapping: "is_base_layer",
        persist: false
      }, {
        name: "single_tile",
        type: "boolean",
        mapping: "single_tile",
        persist: false
      }, {
        name: "options",
        type: "string",
        mapping: "options",
        persist: false
      }, {
        name: "filter_string",
        type: "string",
        mapping: "filter_string"
      }
    ],
    getLayer: function() {
      var layer;
      layer = this.get("layer");
      if (!layer) {
        layer = this.createLayer();
        this.setLayer(layer);
      }
      return layer;
    },
    setLayer: function(layer) {
      this.set("layer", layer);
    },
    createLayer: function() {
      var ol_class, options, params, url;
      ol_class = this.get('ollayer_class');
      if (ol_class === 'OpenLayers.Layer.WMS') {
        params = Ext.merge({
          format: 'image/png',
          transparent: !this.get('is_base_layer')
        }, {
          url: this.get('url'),
          layers: this.get('layers')
        });
        options = Ext.merge({
          displayInLayerSwitcher: this.get('is_base_layer'),
          displayOutsideMaxExtent: true
        }, {
          isBaseLayer: this.get('is_base_layer'),
          singleTile: this.get('single_tile')
        });
        if (this.get('is_base_layer')) {
          return new OpenLayers.Layer.WMS_baselayer(this.get('name'), params, options);
        } else {
          return new OpenLayers.Layer.WMS(this.get('name'), params, options);
        }
      } else if (ol_class === 'OpenLayers.Layer.OSM') {
        url = this.get('url');
        if (!url) url = null;
        return new OpenLayers.Layer.OSM(this.get('name'), url);
      } else {
        return console.error('dit type wordt niet ondersteund');
      }
    },
    clean_copy: function() {
      debugger;
      var layer;
      layer = this.getLayer().clone();
      delete layer.layer;
      return layer;
    },
    copy: function(id) {
      var layer;
      layer = this.getLayer() && this.getLayer().clone();
      return new this.constructor(Ext.applyIf({
        layer: layer
      }, this.data), id || layer.id);
    }
  });

}).call(this);
