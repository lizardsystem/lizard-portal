Ext.define('Lizard.model.CollageItemModel', {
    # extend : 'Ext.data.Model',
    extend: 'Lizard.model.WorkspaceItemModel',
    fields: [{
        name : "name"
        type: "string"
    },{  # par, mod, stp, loc
        name : "identifier"
        type: "string"
    },{  # From here: properties from Layer object.
        name: "plid"
        type: "integer"
    },{
        name: "use_location_filter"
        type: "boolean"
        persist: false
    },{
        name: "location_filter"
        type: "string"
        persist: false
    },{
        name: "ollayer_class"
        type: "string"
        persist: false
    },{
        name: "title"
        type: "string"
        persist: false
    },{
        name: "layers"
        type: "string"
        persist: false
    },{
        name: "filter"
        type: "string"
        persist: false
    },{
        name: "request_params"
        type: "string"
        persist: false
    },{
        name: "is_base_layer"
        type: "boolean"
        persist: false
    },{
        name: "single_tile"
        type: "boolean"
        persist: false
    },{
        name: "options"
        type: "string"
        persist: false
    },{
        name: "is_local_server"
        type: "boolean"
        persist: false
    },{
        name: "is_clickable"
        type: "boolean"
        persist: false
    },{
        name: "js_popup_class"
        type: "string"
        persist: false
    }]
#     getLayer: () ->
#         layer = @get("layer")
#         if not layer
#             layer = @createLayer()
#         #without event
#         @data.layer = layer

#         return layer

#     setLayer: (layer) ->
#         this.set("layer", layer)
#         return;

#     createLayer: () ->
#         ol_class = @get('ollayer_class')
#         if ol_class == 'OpenLayers.Layer.WMS'
#             params = Ext.merge({
#                     format: 'image/png',
#                     transparent: not @get('is_base_layer')
#                 },
#                 #@get('request_params'),
#                 {
#                     url: @get('url'),
#                     layers: @get('layers')
#             })
#             if @get('use_location_filter') == true
#                 filter = Ext.JSON.decode(@get('location_filter'))
#                 obj = Lizard.CM.getContext().object
#                 if filter.tpl
#                     tpl = new Ext.Template(filter.tpl)
#                     value = tpl.apply(obj)
#                 else
#                     value = obj.id
#                 params[filter.key] = value
#                 #todo: combine this filter with next filter

#             if @get('filter')
#                 # debugger
#                 cql_filter: @get('filter')



#             options = Ext.merge({
#                     displayInLayerSwitcher: true #@get('is_base_layer')
#                     displayOutsideMaxExtent: true
#                     visibility: @get('visibility') || true
#                 },
#                 #@get('options'),
#                 {
#                     isBaseLayer: @get('is_base_layer'),
#                     singleTile: @get('single_tile')
#             })


#             if @get('is_base_layer')
#                 options.projection = new OpenLayers.Projection('EPSG:900913')
#                 options.init_900913 = true
#                 return new OpenLayers.Layer.WMS_baselayer(
#                     @get('title'),
#                     @get('url'),
#                     params,
#                     options
#                 )
#             else
#                 return new OpenLayers.Layer.WMS(
#                     @get('title'),
#                     @get('url'),
#                     params,
#                     options
#                 )
#         else if ol_class == 'OpenLayers.Layer.OSM'
#             url = @get('url')
#             if not url
#                 url = null
#             return new OpenLayers.Layer.OSM(
#                 @get('name')
#                 #url  -> url has some problems with context switches. removed for now
#             )
#         else
#             console.error('dit type wordt niet ondersteund')

#     #copy without layer
#     clean_copy: () ->
#         layer = @getLayer().clone()
#         delete layer.layer
#         return layer


#     copy: (id) ->
#         layer = @getLayer() && @getLayer().clone()
#         return new @constructor(Ext.applyIf({
#             layer: layer
#         }, @data), id || layer.id)

})
