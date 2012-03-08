# Workspace portlet.
# Load workspace: choose from a list of workspaces.
# Save workspace: provide info, then save.

Ext.define('Lizard.portlet.MapPortlet', {
    extend: 'GeoExt.panel.Map'
#    mixins: [
#        'Lizard.portlet.Portlet'
#    ]
    alias: 'widget.mapportlet'
    title: 'Map'
    #layers = LayerStore
    #layers = workspace store?

    tbar: [{
        xtype: 'button',
        text: 'test'
    }
    '->'
    {
        fieldLabel: 'Achtergrondkaart',
        name: 'base_layer',
        displayField: 'name',
        valueField: 'id',
        xtype: 'combo',
        queryMode: 'remote',
        typeAhead: false,
        minChars:0,
        forceSelection: true,
        width: 200,
        store: {
            fields: ['id', 'name'],
            proxy: {
                type: 'ajax',
                url: '/measure/api/organization/?_accept=application%2Fjson&size=id_name',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            }
        }
    }]

    onMapClickCallback: (records, event, lonlat, xhr, request) ->
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
            # alert(records[0].data)
            Ext.create('Ext.window.Window', {
                title: 'locatie',
                modal: true,

                xtype: 'leditgrid'
                itemId: 'map popup'

                finish_edit_function: (updated_record) ->
                    debugger

                editpopup: true,
                items: [{
                    xtype: 'panel'
                    width: 400
                    height: 400
                    html: 'some content ' + records[0].data.geo_ident
                    bbar: [{
                        text: 'Okee dan'
                        handler: (btn, event) ->
                            window = @up('window')
                            window.close()
                    }]
                }]
            }).show();
        else
            alert('nothing found')


    onMapClick: (event, lonlat, callback) ->
        me = @
        # Find the first clickable layer
        #debugger
        layer = @layers.findRecord('clickable',true)
        if not layer
            alert('geen kaartlaag geselecteerd')
            return

        # Somehow layer.get('layers') is empty, so we use event.object... instead
        params = {
            REQUEST: "GetFeatureInfo",
            EXCEPTIONS: "application/vnd.ogc.se_xml",
            BBOX: @map.getExtent().toBBOX(),
            X: event.xy.x,
            Y: event.xy.y,
            INFO_FORMAT: 'application/vnd.ogc.gml',
            QUERY_LAYERS:  event.object.layers[1].params.LAYERS,
            LAYERS: event.object.layers[1].params.LAYERS,
            FEATURE_COUNT: 1,
            WIDTH: @map.size.w,
            HEIGHT: @map.size.h,
            SRS: 'EPSG:900913' # @map.projection  it says EPSG:4326
        }

        # Check if url is from our server.
        # if layer.get('url').contains('http')
        #     #request external server through our server
        #     # Does not work yet
        #     url = layer.getFullRequestString(params, layer.url);

        #     Ext.Ajax.request({
        #         url: '/portal/getFeatureInfo/',
        #         reader:{
        #             type: 'xml'
        #         },
        #         params: {
        #             request: Ext.JSON.encode(params)
        #         }
        #         method: 'GET',
        #         success: (xhr, request) ->
        #              gml_text = xhr.responseText;
        #              format = new OpenLayers.Format.GML.v3();
        #              gml = format.read(gml_text);
        #              me.onMapClickCallback(gml, event, lonlat, xhr, request);

        #         failure: (xhr) ->
        #              alert('failure');
        #     })

        # else
        if layer.get('url') == ''
            alert('Test: Selecteer een andere kaartlaag als bovenste clickable')
            return
        if true
            #request direct from lizard server
            # Does not work yet
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
                        me.onMapClickCallback(gml, event, lonlat, xhr, request);
                    else
                        alert('Niks gevonden debug: ' + gml_text)
                failure: (xhr) ->
                    alert('failure');
            });





    initComponent: () ->
        me = @

#        if not @workspaceStore
#            @workspaceStore = Ext.create(Lizard.store.WorkspaceStore, {layerStore: @store})

        @callParent(arguments)
})

