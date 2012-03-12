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
        # Records is a list of gml objects. They have the following properties:
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



        if records.length > 0

            #workspaceitem.popup_class .show(records)


            if records[0].data.par_ident #temporary check if measure

                dt_start = Ext.Date.format(Lizard.CM.getContext().period.start, 'Y-m-d H:i:s')
                dt_end = Ext.Date.format(Lizard.CM.getContext().period.end, 'Y-m-d H:i:s')
                # http://localhost:8000/graph/?dt_start=2011-02-11%2000:00:00&dt_end=2011-11-11%2000:00:00&item={%22fews_norm_source_slug%22:%22waternet%22,%22location%22:%223201%22,%22parameter%22:%22Q_berekend.in.cumulatief%22,%22type%22:%22line%22,%22time_step%22:%22SETS1440TZ1%22}&dt_start=2005-01-01%2000:00:00&dt_end=2011-01-01%2000:00:00
                record = records[0]

                Ext.create('Ext.window.Window', {
                    title: 'locatie',
                    modal: true,

                    xtype: 'leditgrid'
                    itemId: 'map popup'

                    finish_edit_function: (updated_record) ->
                    #pass

                    editpopup: true,
                    items: [{
                        xtype: 'panel'
                        width: 1050
                        height: 550
                        html: 'Grafiek voor ' + record.data.geo_ident + ' ' + record.data.par_ident + ' ' + record.data.mod_ident + ' ' + record.data.stp_ident + '<img src="/graph/?dt_start=' + dt_start + '&dt_end=' + dt_end + '&width=1000&height=500&item={%22fews_norm_source_slug%22:%22waternet%22,%22location%22:%22' + record.data.geo_ident + '%22,%22parameter%22:%22' + record.data.par_ident + '%22,%22type%22:%22line%22,%22time_step%22:%22' + record.data.stp_ident + '%22,%22module%22:%22' + record.data.mod_ident + '%22}" />'
                        tbar: [{
                            text: 'Voeg toe aan collage'
                            handler: (btn, event) ->
                                window = @up('window')
                                window.close()
                        }]
                    }]
                }).show()


            else

                #debugger
                # http://localhost:8000/graph/?dt_start=2011-02-11%2000:00:00&dt_end=2011-11-11%2000:00:00&item={%22fews_norm_source_slug%22:%22waternet%22,%22location%22:%223201%22,%22parameter%22:%22Q_berekend.in.cumulatief%22,%22type%22:%22line%22,%22time_step%22:%22SETS1440TZ1%22}&dt_start=2005-01-01%2000:00:00&dt_end=2011-01-01%2000:00:00
                record = records[0]

                data = []

                Ext.Object.each(record.data, (key, value)->
                    data.push({key:key, value:value})
                )

                tpl = new Ext.XTemplate(
                    '<div class="lizard">'
                    '<h2>Kaartlaag: {layer_name}</h2>',
                    '<table>',
                    '<tpl for="fields">',
                    '<tr><td>{key}</td><td>{value}</td></tr>',
                    '</tpl></table></div>'
                );
                html = tpl.applyTemplate({
                    layer_name: workspaceitem.get('title'),
                    fields:data
                });

                Ext.create('Ext.window.Window', {
                    title: 'Info',
                    popup_type: 'feature_info'
                    items: [{
                        xtype: 'panel'
                        width: 400
                        html: html
                    }]
                }).show()

        else
            alert('nothing found')


    onMapClick: (event, lonlat, callback) ->
        me = @
        # Find the first clickable layer
        layer = @layers.findRecord('clickable',true)
        if not layer
            Ext.Msg.alert('', 'geen kaartlaag geselecteerd')
            return

        # Somehow layer.get('layers') is empty, so we use event.object... instead
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
            SRS: @map.projection.projCode
        }

        if layer.get('url') == ''
            alert('Test: Selecteer een andere kaartlaag als bovenste clickable')
            return

        else if layer.get('url').contains('http')
            #request through a proxy on our server
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
                     else
                        alert('Niks gevonden debug: ' + gml_text)
                failure: (xhr) ->
                    alert('failure');
            })

        else
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
                    else
                        alert('Niks gevonden debug: ' + gml_text)
                failure: (xhr) ->
                    alert('failure');
            });


    initComponent: () ->
        me = @

        @layers = @workspaceStore.workspaceItemStore
        @callParent(arguments)

})

