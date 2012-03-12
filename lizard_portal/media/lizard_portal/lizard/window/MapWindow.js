(function() {

  Ext.define('Lizard.window.MapWindow', {
    extend: 'Ext.window.Window',
    title: 'Kaart',
    layout: {
      type: 'vbox',
      align: 'stretch'
    },
    mapeditor: true,
    force_type_selection: true,
    edit_point: true,
    edit_line: true,
    edit_polygon: true,
    statics: {
      show: function(config) {
        var map_window, map_windows;
        if (config == null) config = {};
        map_windows = [];
        if (config.window_ref) {
          map_windows = Ext.WindowManager.getBy(function(obj) {
            if (obj.window_ref = config.window_ref) {
              return true;
            } else {
              return false;
            }
          });
        }
        if (map_windows.length > 0) {
          map_window = map_windows[0];
          return Ext.WindowManager.bringToFront(map_window);
        } else {
          return map_window = Ext.create('Lizard.window.MapWindow', config).show();
        }
      }
    },
    start_geometry: 'MULTIPOINT(2 2, 3 3, 4 4)',
    format: new OpenLayers.Format.WKT(),
    serialize: function(feature) {
      var str;
      str = this.format.write(feature);
      return str;
    },
    deserialize: function(features_string) {
      var bounds, elem, feature, features, final_features, geometry_type, _i, _j, _k, _len, _len2, _len3, _ref;
      features = this.format.read(features_string);
      if (features.geometry) {
        this.geometry_type = features.geometry.CLASS_NAME;
      } else if (features[0].geometry) {
        this.geometry_type = features[0].geometry.CLASS_NAME;
      }
      if (features) {
        if (features.constructor !== Array) features = [features];
        final_features = [];
        for (_i = 0, _len = features.length; _i < _len; _i++) {
          feature = features[_i];
          debugger;
          if (['OpenLayers.Geometry.MultiPoint', 'OpenLayers.Geometry.MultiLine', 'OpenLayers.Geometry.MultiPolygon'].indexOf(feature.geometry.CLASS_NAME) >= 0) {
            _ref = feature.geometry.components;
            for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
              elem = _ref[_j];
              final_features = final_features.concat(new OpenLayers.Feature.Vector(elem));
            }
          } else {
            final_features = final_features.concat(feature);
          }
        }
        features = final_features;
        geometry_type = features[0].geometry.CLASS_NAME;
        debugger;
        for (_k = 0, _len3 = features.length; _k < _len3; _k++) {
          feature = features[_k];
          if (!bounds) {
            bounds = feature.geometry.getBounds();
          } else {
            bounds.extend(feature.geometry.getBounds());
          }
        }
        if (!this.active_edit_layer) {
          if (geometry_type === 'OpenLayers.Geometry.Point') {
            this.active_edit_layer = this.points;
          } else if (geometry_type === 'OpenLayers.Geometry.Line') {
            this.active_edit_layer = this.lines;
          } else if (geometry_type === 'OpenLayers.Geometry.Polygon') {
            this.active_edit_layer = this.polygons;
          } else {
            alert('geometry type wordt niet ondersteund');
            return false;
          }
          return this.active_edit_layer.addFeatures(features);
        }
      }
    },
    constructor: function(config) {
      this.initConfig(config);
      return this.callParent(arguments);
    },
    initComponent: function() {
      var config, controls, items, layers, map, map_controls, me, tbar, toggleControl, type_selection, vlayer;
      me = this;
      this.height = this.height || (window.innerHeight - 200);
      this.width = this.width || 500;
      this.points = new OpenLayers.Layer.Vector("Editable points", {
        geometryType: OpenLayers.Geometry.Point
      });
      this.lines = new OpenLayers.Layer.Vector("Editable lines", {
        geometryType: OpenLayers.Geometry.Line
      });
      this.polygons = new OpenLayers.Layer.Vector("Editable polygons", {
        geometryType: OpenLayers.Geometry.Polygon
      });
      this.active_editable_layer = null;
      this.active_editor = null;
      this.active_edit_layer = null;
      vlayer = new OpenLayers.Layer.OSM();
      if (this.start_geometry) this.deserialize(this.start_geometry);
      layers = [vlayer, this.points, this.lines, this.polygons];
      map_controls = [new OpenLayers.Control.LayerSwitcher()];
      items = [];
      if (this.mapeditor && this.force_type_selection) {
        controls = {
          point: new OpenLayers.Control.DrawFeature(this.points, OpenLayers.Handler.Point),
          line: new OpenLayers.Control.DrawFeature(this.lines, OpenLayers.Handler.Path),
          polygon: new OpenLayers.Control.DrawFeature(this.polygons, OpenLayers.Handler.Polygon),
          modify_point: new OpenLayers.Control.ModifyFeature(this.points),
          modify_line: new OpenLayers.Control.ModifyFeature(this.lines),
          modify_polygon: new OpenLayers.Control.ModifyFeature(this.polygons)
        };
        Ext.Object.each(controls, function(key, control) {
          return map_controls.push(control);
        });
        toggleControl = function(form) {
          var editor, values;
          values = form.getValues();
          editor = null;
          if (values.geometry === 'point') {
            me.active_edit_layer = me.points;
          } else if (values.geometry === 'line') {
            me.active_edit_layer = me.lines;
          } else if (values.geometry === 'polygon') {
            me.active_edit_layer = me.polygons;
          }
          if (values.edit_action === 'modify') {
            if (values.geometry === 'point') {
              editor = 'modify_point';
            } else if (values.geometry === 'line') {
              editor = 'modify_line';
            } else if (values.geometry === 'polygon') {
              editor = 'modify_polygon';
            }
          } else if (values.edit_action === 'draw') {
            if (values.geometry === 'point') {
              editor = 'point';
            } else if (values.geometry === 'line') {
              editor = 'line';
            } else if (values.geometry === 'polygon') {
              editor = 'polygon';
            }
          } else {
            editor = 'drag';
          }
          return Ext.Object.each(controls, function(key, control) {
            if (editor === key) {
              control.activate();
              console.log('activate contol ' + key);
              me.active_editor = control;
              return null;
            } else {
              control.deactivate();
              return null;
            }
          });
        };
        tbar = [
          {
            xtype: 'button',
            text: 'Undo',
            handler: function() {
              if (me.active_editor.undo) return me.active_editor.undo();
            }
          }, {
            xtype: 'button',
            text: 'Verwijder',
            handler: function() {
              debugger;
              var feature;
              if (me.active_editor.feature) {
                feature = me.active_editor.feature;
                me.active_editor.unselectFeature(feature);
                return me.active_editor.layer.destroyFeatures([feature]);
              }
            }
          }
        ];
      }
      if (!this.extent) {
        this.extent = new OpenLayers.Bounds(Lizard.CM.getContext().init_zoom[0], Lizard.CM.getContext().init_zoom[1], Lizard.CM.getContext().init_zoom[2], Lizard.CM.getContext().init_zoom[3]);
      }
      map = Ext.create(GeoExt.panel.Map, {
        flex: 1,
        initZoomOnRender: true,
        controls: map_controls,
        layers: layers,
        extent: this.extent
      });
      controls.drag = map.navigation;
      items.push(map);
      if (this.mapeditor && this.force_type_selection) {
        type_selection = [];
        if (this.edit_point) {
          type_selection.push({
            boxLabel: 'point',
            name: 'geometry',
            inputValue: 'point',
            checked: true
          });
        }
        if (this.edit_line) {
          type_selection.push({
            boxLabel: 'line',
            name: 'geometry',
            inputValue: 'line'
          });
        }
        if (this.edit_polygon) {
          type_selection.push({
            boxLabel: 'polygon',
            name: 'geometry',
            inputValue: 'polygon'
          });
        }
        items.push({
          frame: true,
          xtype: 'form',
          bodyStyle: 'padding:5px 5px 0',
          fieldDefaults: {
            msgTarget: 'side',
            labelWidth: 90
          },
          defaults: {
            anchor: '100%'
          },
          items: [
            {
              xtype: 'radiogroup',
              name: 'geometry_type_selection',
              fieldLabel: 'Geometrie type (max 1 mogelijk)',
              columns: 3,
              vertical: false,
              items: type_selection,
              listeners: {
                change: function(field, new_value, old_value, optional) {
                  var form;
                  if (typeof new_value.geometry === 'string') {
                    form = field.up('form').getForm();
                    return toggleControl(form);
                  }
                }
              }
            }, {
              xtype: 'radiogroup',
              name: 'geom_edit_action',
              fieldLabel: 'Actie',
              columns: 3,
              vertical: false,
              items: [
                {
                  boxLabel: 'navigeer',
                  name: 'edit_action',
                  inputValue: 'drag',
                  checked: true
                }, {
                  boxLabel: 'teken',
                  name: 'edit_action',
                  inputValue: 'draw'
                }, {
                  boxLabel: 'aanpassen',
                  name: 'edit_action',
                  inputValue: 'modify'
                }
              ],
              listeners: {
                change: function(field, new_value, old_value, optional) {
                  var form;
                  if (typeof new_value.edit_action === 'string') {
                    form = field.up('form').getForm();
                    return toggleControl(form);
                  }
                }
              }
            }
          ]
        });
      }
      items.push();
      config = {
        items: items
      };
      if (tbar) config.tbar = tbar;
      config.bbar = {
        xtype: 'button',
        text: 'Klaar met bewerken',
        handler: function(button) {
          var window, wkt;
          wkt = me.serialize(me.active_edit_layer.features);
          if (me.callback) me.callback(wkt);
          window = button.up('window');
          return window.close();
        }
      };
      Ext.apply(this, config);
      return this.callParent(arguments);
    }
  });

}).call(this);
