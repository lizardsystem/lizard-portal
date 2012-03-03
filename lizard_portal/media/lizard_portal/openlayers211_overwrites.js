
OpenLayers.Layer.Vector.prototype.redraw = function() {
    if (OpenLayers.Renderer.NG && this.renderer instanceof OpenLayers.Renderer.NG) {
          this.drawn = false;
    }
    return OpenLayers.Layer.prototype.redraw.apply(this, arguments);
}


OpenLayers.Layer.Vector.prototype.moveTo = function(bounds, zoomChanged, dragging) {
     OpenLayers.Layer.prototype.moveTo.apply(this, arguments);

     var ng = (OpenLayers.Renderer.NG && this.renderer instanceof OpenLayers.Renderer.NG);
     if (ng) {
          zoomChanged && this.renderer.updateDimensions();
     } else {
          var coordSysUnchanged = true;

          if (!dragging) {
              this.renderer.root.style.visibility = "hidden";

              this.div.style.left = -parseInt(this.map.layerContainerDiv.style.left) + "px";
              this.div.style.top = -parseInt(this.map.layerContainerDiv.style.top) + "px";
              var extent = this.map.getExtent();
              coordSysUnchanged = this.renderer.setExtent(extent, zoomChanged);

              this.renderer.root.style.visibility = "visible";

              // Force a reflow on gecko based browsers to prevent jump/flicker.
              // This seems to happen on only certain configurations; it was originally
              // noticed in FF 2.0 and Linux.
              if (OpenLayers.IS_GECKO === true) {
                  this.div.scrollLeft = this.div.scrollLeft;
              }

              if(!zoomChanged && coordSysUnchanged) {
                  for(var i in this.unrenderedFeatures) {
                      var feature = this.unrenderedFeatures[i];
                      this.drawFeature(feature);
                  }
              }
          }
     }
     if (!this.drawn || (!ng && (zoomChanged || !coordSysUnchanged))) {
          this.drawn = true;
         var feature;
          for(var i=0, len=this.features.length; i<len; i++) {
              this.renderer.locked = (i !== (len - 1));
              feature = this.features[i];
              this.drawFeature(feature);
          }
     }
}

OpenLayers.Layer.WMS.prototype.displayInLayerSwitcher = false

OpenLayers.Layer.WMS_baselayer = OpenLayers.Class(OpenLayers.Layer.WMS, {

    isBaseLayer: true,
    displayInLayerSwitcher: true,

    initialize: function(name, url, params, options) {
        var newArguments = [];

        if (options.sphericalMercator == true && options.isBaseLayer == true) {
            options.maxExtent= new OpenLayers.Bounds(
                        -128 * 156543.03390625,
                        -128 * 156543.03390625,
                        128 * 156543.03390625,
                        128 * 156543.03390625
                    );
            options.maxResolution= 156543.03390625;
            options.numZoomLevels= 19;
            options.units= "m";

        }

        //uppercase params
        params = OpenLayers.Util.upperCaseObject(params);
        if (parseFloat(params.VERSION) >= 1.3 && !params.EXCEPTIONS) {
            params.EXCEPTIONS = "INIMAGE";
        }
        newArguments.push(name, url, params, options);
        OpenLayers.Layer.Grid.prototype.initialize.apply(this, newArguments);
        OpenLayers.Util.applyDefaults(
                       this.params,
                       OpenLayers.Util.upperCaseObject(this.DEFAULT_PARAMS)
                       );


        //layer is transparent
        if (!this.noMagic && this.params.TRANSPARENT &&
            this.params.TRANSPARENT.toString().toLowerCase() == "true") {

            // unless explicitly set in options, make layer an overlay
            if ( (options == null) || (!options.isBaseLayer) ) {
                this.isBaseLayer = false;
            }

            // jpegs can never be transparent, so intelligently switch the
            //  format, depending on the browser's capabilities
            if (this.params.FORMAT == "image/jpeg") {
                this.params.FORMAT = OpenLayers.Util.alphaHack() ? "image/gif"
                                                                 : "image/png";
            }
        }

    }
})