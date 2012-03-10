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
        alert(records[0].data)


    onMapClick: (event, lonlat, callback) ->
        me=this;

        debugger

        layer = @layers.findRecord('clickable',true)
        if not layer
            alert('geen kaartlaag geselecteerd')
            return


        params = {
            REQUEST: "GetFeatureInfo",
            EXCEPTIONS: "application/vnd.ogc.se_xml",
            BBOX: @map.getExtent().toBBOX(),
            X: event.xy.x,
            Y: event.xy.y,
            INFO_FORMAT: 'application/vnd.ogc.gml',
            QUERY_LAYERS: layer.layers #event.object.layers[1].params.LAYERS,
            LAYERS: layer.layers,
            FEATURE_COUNT: 1,
            WIDTH: @map.size.w,
            HEIGHT: @map.size.h,
            SRS: @map.projection.projCode
        }

        if layer.get('url').contains('http')
            #request through our server
            url = layer.get('layer').getFullRequestString(params, layer.get('url'));

            Ext.Ajax.request({
                url: '/portal/getFeatureInfo/',
                reader:{
                    type: 'xml'
                },
                params: {
                    request: Ext.JSON.encode(params)
                }
                method: 'GET',
                success: (xhr, request) ->
                     gml_text = xhr.responseText;
                     format = new OpenLayers.Format.GML.v3();
                     gml = format.read(gml_text);
                     me.onMapClickCallback(gml, event, lonlat, xhr, request);

                failure: (xhr) ->
                     alert('failure');
            })

        else
            #request direct
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
                    me.onMapClickCallback(gml, event, lonlat, xhr, request);

                failure: (xhr) ->
                    alert('failure');
            });





    initComponent: () ->
        me = @

#        if not @workspaceStore
#            @workspaceStore = Ext.create(Lizard.store.WorkspaceStore, {layerStore: @store})

        @callParent(arguments)
})

