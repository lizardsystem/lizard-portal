# Workspace portlet.
# Load workspace: choose from a list of workspaces.
# Save workspace: provide info, then save.

Ext.define('Lizard.portlet.MapPortlet', {
    extend: 'GeoExt.panel.Map'
#    mixins: [
#        'Lizard.portlet.Portlet'
#    ]

    default_zoom: null
    alias: 'widget.mapportlet'
    title: 'Map'
    plugins: [
      'applycontext'
    ],
    autoLoadWorkspaceStore: null,
    #workspaceStore = workspace store

#  Button for returning to default zoom for area. use function below to load extends for area and set default_zoom for button
#
#  example function for storing default area zoom:
#    onApplyParams: function(params) {
#        var me = this;
#        me.setLoading(true);
#        Ext.Ajax.request({
#            url: '/area/api/area_special/'+ params.object.id +'/',
#            method: 'GET',
#            params: {
#                _accept: 'application/json'
#            },
#            success: function(xhr) {
#                var area_data = Ext.JSON.decode(xhr.responseText).area;
#                me.default_zoom = area_data.extent
#                me.map.zoomToExtent(new OpenLayers.Bounds.fromArray(area_data.extent));
#                return me.setLoading(false);
#            },
#            failure: function() {
#                Ext.Msg.alert("portal creation failed", "Server communication failure");
#                return me.setLoading(false);
#            }
#        });
#    },

    tbar: [{

        xtype: 'button',
        text: 'Zoom gebied'
        handler: (button, event) ->
            panel = button.up('panel')
            panel.map.zoomToExtent(new OpenLayers.Bounds.fromArray(panel.default_zoom))


    }
    '->'
    {
        xtype: 'button',
        text: 'achtergrond',
        handler: (button, event) ->

            config = {}
            panel = button.up('panel')
            index = panel.layers.find('is_base_layer', true)
            if index >= 0
                background = panel.layers.getAt(index)
                config.init_background_id = background.get('id')

            Lizard.form.BackgroundLayerSelector.show(config)
    }]

    applyParams: (params) ->
        me = @
        if params.background_layer
            @setBackgroundLayer(params.background_layer)

        if params.object
            @layers.each((record) ->

                if record.get('use_location_filter') == true
                    layer = record.getLayer()
                    #try:
                    filter = Ext.JSON.decode(record.get('location_filter'))
                    if filter.tpl
                        tpl = new Ext.Template(filter.tpl)
                        value = tpl.apply(params.object)
                    else
                        value = params.object.id
                    request_params={}
                    request_params[filter.key] = value
                    layer.mergeNewParams(request_params)
                    #except:
                    #    alert('error in filter function')
            )




        @onApplyParams(params)


    onApplyParams: Ext.emptyFn



    setBackgroundLayer: (config) ->
        me = @

        if config and @background_layer_id
            if config.plid == @background_layer_id
                return
                #layer already active

        existing_background_layers = @layers.queryBy((record, id) ->
            if record.get('is_base_layer') == true
                return true
            else
                return
            )

        item = @layers.createWorkspaceItem(config, 0)
        @background_layer_id = config.plid
        @background_layer = config

        @map.setBaseLayer(item.getLayer())

        existing_background_layers.each( (background_layer) ->
            me.layers.remove(background_layer)
        )

    onMapClickCallback: (records, workspaceitem, event, lonlat, xhr, request) ->
        # Records is a list of gml objects with the following properties:
        # active: "true"
        # fews_norm_source_id: "2"
        # geo_ident: "MBP014"
        # icon: "LizardIconRWZIZW.gif"
        # id: "1952"
        # mod_ident: "ESF2_Bewerkingen"
        # name: "MBP014"
        # par_ident: "Gloeirest.Efractie"
        # qua_ident: "Zomer"
        # shortname: "MBP014"
        # stp_ident: "CTS_M_GMT+01:00"
        # tooltip: "None"

        # Workspaceitem:
        # checked: false
        # clickable: true
        # filter: "par_ident='CL' and mod_ident='Import_Reeksen' and stp_ident='NETS'"
        # filter_string: ""
        # id: 1234
        # is_base_layer: false
        # is_clickable: true
        # is_local_server: true
        # js_popup_class: false
        # layer: OpenLayers.Layer.WMS.OpenLayers.Class.initialize
        # layers: "vss:fews_locations"
        # leaf: true
        # location_filter: ""
        # ollayer_class: "OpenLayers.Layer.WMS"
        # opacity: 0
        # options: "{}"
        # order: 0
        # plid: 1234
        # request_params: "{}"
        # single_tile: false
        # text: "Chloride (NETS)"
        # title: "Chloride (NETS)"
        # url: "http://localhost:8000/layers/wms/"
        # use_location_filter: false
        # visibility: true
        # visible: true

        if records.length > 0
            # Find popup class and feed it with records.
            popup_class_name = 'Lizard.popup.' + workspaceitem.get('js_popup_class')
            popup_class = Ext.ClassManager.get(popup_class_name)
            if not popup_class
                # Default fall-back
                popup_class = Ext.ClassManager.get('Lizard.popup.FeatureInfo')
                console.error("Cannot find popup class " + popup_class_name)
            popup_class.show(records, workspaceitem)
        else
            alert('nothing found')


    onMapClick: (event, lonlat, callback) ->
        me = @
        # Find the first clickable layer which is enabled as well.
        layer = @layers.findRecord('clickable',true)
        if not layer
            Ext.Msg.alert('', 'geen kaartlaag geselecteerd')
            return

        # Somehow layer.get('layers') is empty, so we use event.object... instead

        # SRS: "EPSG:900913" @map.projection.projCode should be 900913
        # but is 4326 instead
        params = {
            REQUEST: "GetFeatureInfo",
            EXCEPTIONS: "application/vnd.ogc.se_xml",
            BBOX: @map.getExtent().toBBOX(),
            X: Math.round(event.xy.x),
            Y: Math.round(event.xy.y),
            INFO_FORMAT: 'application/vnd.ogc.gml',
            QUERY_LAYERS: layer.get('layers') #event.object.layers[1].params.LAYERS,
            LAYERS: layer.get('layers'),
            FEATURE_COUNT: 2,  # testing, should be a low number like 1
            WIDTH: @map.size.w,
            HEIGHT: @map.size.h,
            SRS: "EPSG:900913"  # @map.projection.projCode
        }

        if layer.get('url') == ''
            alert('Test: Selecteer een andere kaartlaag als bovenste clickable')

        else if not layer.get('is_local_server')
            # Request through a proxy on our server
            url = layer.get('layer').getFullRequestString(params, layer.get('url'));

            Ext.Ajax.request({
                url: '/portal/getFeatureInfo/',
                reader:{
                    type: 'xml'
                },
                params: {
                    request: Ext.JSON.encode(url)
                }
                method: 'GET',
                success: (xhr, request) ->
                     gml_text = xhr.responseText;
                     format = new OpenLayers.Format.GML.v3();
                     gml = format.read(gml_text);
                     if gml.length > 0
                         me.onMapClickCallback(gml, layer, event, lonlat, xhr, request);
                     # else
                     #    alert('Niks gevonden proxy debug: ' + gml_text)
                failure: (xhr) ->
                    alert('failure');
            })

        else
            # Direct request to local server.
            Ext.Ajax.request({
                url: layer.get('url'),
                reader:{
                    type: 'xml'
                },
                params: params
                method: 'GET',
                success: (xhr, request) ->
                    gml_text = xhr.responseText;
                    format = new OpenLayers.Format.GML.v3();
                    gml = format.read(gml_text);
                    if gml.length > 0
                        me.onMapClickCallback(gml, layer, event, lonlat, xhr, request);
                    # else
                    #     alert('Niks gevonden debug: ' + gml_text)
                failure: (xhr) ->
                    alert('failure');
            });


    initComponent: () ->
        me = @

        @layers = @workspaceStore.workspaceItemStore
        @callParent(arguments)

    afterRender: () ->
        @callParent(arguments)



})

