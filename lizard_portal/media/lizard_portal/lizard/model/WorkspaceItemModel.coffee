Ext.define('Lizard.model.WorkspaceItemModel', {
    extend : 'Ext.data.Model',
    #idProperty : "name",
    fields : [{
        name : "id"
        type: "number"
    }, {
        name : "layer",
        persist: false
    },{  # From Layer
        name: 'plid',
        mapping: 'plid',
        type: 'auto'
    },{
        name: 'checked',
        type: 'boolean'
    },{
        name: 'text',
        type: 'string'
    },{
        name: 'leaf',
        type: 'boolean'
    },{
        name : "title",
        type : "string",
        mapping : "title"
    },{
        name : "order",
        type : "number",
        mapping : "order"
    },{
        name : "visibility",
        type : "boolean",
        defaultValue: true,
        mapping : "visibility"
    },{
        name : "clickable",
        type : "boolean",
        defaultValue: true,
        mapping : "clickable"
    },{
        name : "opacity",
        type : "number",
        defaultValue: 0,
        mapping : "opacity"
    },{
        name : "use_location_filter",
        type : "boolean",
        mapping : "use_location_filter",
        persist: false
    },{
        name : "location_filter",
        type : "string",
        mapping : "location_filter",
        persist: false
    },{
        name : "ollayer_class",
        type : "string",
        mapping : "ollayer_class",
        persist: false
    },{
        name : "url",
        type : "string",
        mapping : "url",
        persist: false
    },{
        name : "layers",
        type : "string",
        mapping : "layers",
        persist: false
    },{
        name : "filter",
        type : "string",
        mapping : "filter",
        persist: false
    },{
        name : "request_params",
        type : "string",
        mapping : "request_params",
        persist: false
    },{
        name : "is_base_layer",
        type : "boolean",
        mapping : "is_base_layer",
        persist: false
    },{
        name : "single_tile",
        type : "boolean",
        mapping : "single_tile",
        persist: false
    },{
        name : "options",
        type : "string",
        mapping : "options",
        persist: false
    },{  # Not from Layer?
        name : "filter_string",
        type : "string",
        mapping : "filter_string"
    },{
        name : "is_local_server",
        type : "boolean",
        mapping : "is_local_server",
        persist: false
    },{
        name : "is_clickable",
        type : "boolean",
        mapping : "is_clickable",
        persist: false
    },{
        name : "js_popup_class",
        type : "string",
        mapping : "js_popup_class",
        persist: false
    }],
    getLayer: () ->
        layer = @get("layer")
        if not layer
            layer = @createLayer()
        #without event
        @data.layer = layer

        return layer

    setLayer: (layer) ->
        this.set("layer", layer)
        return;
#        //orgineel
#        var me = this;
#        if(layer !== me.getLayer) {
#          me.dirty = true;
#          if(!me.modified) {
#            me.modified = {};
#          }
#          if(me.modified.layer === undefined) {
#            me.modified.layer = me.data.layer;
#          }
#          me.data.layer = layer;
#          if(!me.editing) {
#            me.afterEdit();
#          }
#        }

    createLayer: () ->
        ol_class = @get('ollayer_class')
        if ol_class == 'OpenLayers.Layer.WMS'
            params = Ext.merge({
                    format: 'image/png',
                    transparent: not @get('is_base_layer')
                },
                #@get('request_params'),
                {
                    url: @get('url'),
                    layers: @get('layers')
            })
            if @get('use_location_filter') == true
                filter = Ext.JSON.decode(@get('location_filter'))
                obj = Lizard.CM.getContext().object
                if filter.tpl
                    tpl = new Ext.Template(filter.tpl)
                    value = tpl.apply(obj)
                else
                    value = obj.id
                params[filter.key] = value
                #todo: combine this filter with next filter

            if @get('filter')
                # debugger
                cql_filter: @get('filter')



            options = Ext.merge({
                    displayInLayerSwitcher: true #@get('is_base_layer')
                    displayOutsideMaxExtent: true
                    visibility: @get('visibility') || true
                },
                #@get('options'),
                {
                    isBaseLayer: @get('is_base_layer'),
                    singleTile: @get('single_tile')
            })


            if @get('is_base_layer')
                options.projection = new OpenLayers.Projection('EPSG:900913')
                options.init_900913 = true
                return new OpenLayers.Layer.WMS_baselayer(
                    @get('title'),
                    @get('url'),
                    params,
                    options
                )
            else
                return new OpenLayers.Layer.WMS(
                    @get('title'),
                    @get('url'),
                    params,
                    options
                )
        else if ol_class == 'OpenLayers.Layer.OSM'
            url = @get('url')
            if not url
                url = null
            return new OpenLayers.Layer.OSM(
                @get('name')
                #url  -> url has some problems with context switches. removed for now
            )
        else
            console.error('dit type wordt niet ondersteund')

    #copy without layer
    clean_copy: () ->
        layer = @getLayer().clone()
        delete layer.layer
        return layer


    copy: (id) ->
        layer = @getLayer() && @getLayer().clone()
        return new @constructor(Ext.applyIf({
            layer: layer
        }, @data), id || layer.id)

})
