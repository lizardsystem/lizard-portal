/**
 * Created by JetBrains WebStorm.
 * User: bastiaan.roos
 * Date: 25-7-11
 * Time: 21:27
 * To change this template use File | Settings | File Templates.
 */


Ext.define('Lizard.container.MapPanel', {
    alias: 'widget.map-openlayers',
    config: {
        initial_extent: null,
        initial_zoom: 4,
        initial_coordination: (5,5),
        projection: 'EPSG:900913',
        display_projection: 'EPSG:900913',
        max_extent: null,
        base_layer: 'google',
        map_click_control: null,
        map_hover_control: null,
        zoom_panel: null,
        javascript_click_handler_name: null,
        javascript_hover_handler_name: null,
        MapClickControl: OpenLayers.Class(OpenLayers.Control, {
            defaultHandlerOptions: {
                'single': true,
                'double': false,
                'pixelTolerance': 0,
                'stopSingle': false,
                'stopDouble': false
            },

            initialize: function (options) {
                this.handlerOptions = OpenLayers.Util.extend(
                    {}, this.defaultHandlerOptions
                );
                OpenLayers.Control.prototype.initialize.apply(
                    this, arguments
                );
                this.handler = new OpenLayers.Handler.Click(
                    this, {
                        'click': this.trigger
                    }, this.handlerOptions
                );
            },

            trigger: function (e) {
                var lonlat;
                lonlat = map.getLonLatFromViewPortPx(e.xy);
                eval(javascript_click_handler_name)(lonlat.lon, lonlat.lat, map);//TODO: juiste ref
            }
        }),
        MapHoverControl: OpenLayers.Class(OpenLayers.Control, {
            defaultHandlerOptions: {
                'delay': 500,
                'pixelTolerance': null,
                'stopMove': false
            },
            initialize: function (options) {
                this.handlerOptions = OpenLayers.Util.extend(
                    {}, this.defaultHandlerOptions
                );
                OpenLayers.Control.prototype.initialize.apply(
                    this, arguments
                );
                this.handler = new OpenLayers.Handler.Hover(
                    this,
                    {'pause': this.onPause, 'move': this.onMove},
                    this.handlerOptions
                );
            },
            onPause: function (e) {
                var lonlat;
                lonlat = map.getLonLatFromViewPortPx(e.xy);
                eval(javascript_hover_handler_name)(lonlat.lon, lonlat.lat, map);//TODO: juiste ref
            },
            onMove: function (evt) {
                $("#hover-popup").remove();
            }
        })
    },
    initComponent: function(config) {
        // Make custom OpenLayers._getScriptLocation
        // OpenLayers (OL) cannot get its script location if the filename
        // OpenLayers.js has been changed.
        // This function is needed when loading images etc for OL.
        OpenLayers._getScriptLocation = function () {
            return "/static_media/openlayers/";
        };

        Ext.apply(this, config);
        //get other settings and apply

        this.showMap();
    },
    showMap: function () {
        // Find client-side extra data.
        var max_extent = new OpenLayers.Bounds(this.max_extent);

        // Set up projection and bounds.
        if (projection === "EPSG:900913")
        {
            options = {
                projection: new OpenLayers.Projection(this.projection),
                displayProjection: new OpenLayers.Projection(this.display_projection),
                units: "m",
                numZoomLevels: 18,
                maxExtent: max_extent,
                controls: []
            };
        }
        else if (projection === "EPSG:28992")
        {
            options = {
                projection: new OpenLayers.Projection(this.projection),
                displayProjection: new OpenLayers.Projection(this.display_projection),
                units: "m",
                resolutions: [364, 242, 161, 107, 71, 47, 31, 21, 14, 9, 6, 4, 2.7, 1.8, 0.9, 0.45, 0.2],
                maxExtent: max_extent,
                controls: []
            };
        }
        else
        {
            alert("Lizard-map onjuist geconfigureerd. Staat 'lizard_map.context_processors.processor.processor' in je context processors? Is de background_maps fixture geladen?");
        }

        // Map is globally defined.
        this.map = new OpenLayers.Map('map', options);
        map = this.map;
        // OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;

        //weg? refreshLayers();

        // Set up controls, zoom and center.
        this.map.addControl(new OpenLayers.Control.LayerSwitcher({'ascending': true}));
        // Click handling.
        if (this.javascript_click_handler_name !== null) {
            this.map_click_control = new this.MapClickControl();
            this.map.addControl(this.map_click_control);
            this.map_click_control.activate();
        }
        // Hover handling.
        if (this.javascript_hover_handler_name !== null) {
            this.map_hover_control = new this.MapHoverControl();
            this.map.addControl(this.map_hover_control);
            this.map_hover_control.activate();
        }

        this.zoom_panel = new OpenLayers.Control.Panel();
        this.zoom_panel.addControls([ new ZoomSlider({ zoomStopHeight: 3 }) ]);//TODO: ZoomSlider??
        this.map.addControl(zoom_panel);
        this.map.addControl(new OpenLayers.Control.Navigation());
        this.map.addControl(new OpenLayers.Control.ScaleLine());
        this.map.addControl(new OpenLayers.Control.MousePosition());
        this.map.addControl(new OpenLayers.Control.OverviewMap());
        this.map.addControl(new OpenLayers.Control.KeyboardDefaults());

        // Zoom to startpoint. Important to parse numbers, else a bug in
        // OpenLayers will initially prevent "+" from working.
        //
        // Saving and subsequently restoring a start_extent often results in a
        // zoom level that is decreased by -1. This might be due to rounding
        // errors. By passing true to zoomToExtent, we will get the zoom
        // level that most closely fits the specified bounds.
        // See #2762 and #2794.
        //TODO: get zoomlevel and position from extend and then initialize
        var initial_extent = new OpenLayers.Bounds(this.initial_extent);
        this.map.zoomToExtent(initial_extent, true);
    }
});