{% load get_portal_template %}

{
    itemId: 'esf-1',
    title: 'ESF details',
    xtype: 'portalpanel',
    breadcrumbs: [
        {
            name: 'watersysteemkaart',
            link: 'homepage'
        },
        {
            name: 'ESF details'
        }
    ],
	items: [{
		width:360,
		items: [{
            flex:2,
            title: "Opbouw ESF'en",
            xtype: 'esf_grid',
            store: Ext.create("Vss.store.Esf"),
        {% if perm.is_analyst %}
            editable:true,
        {% else %}
            editable:false,
        {% endif %}
            closable: false
        }]
    },{
        flex:1,
        items: {
            title: 'Grafieken',
            flex: 1,
            xtype: 'multigraph',
            open_map: function(workspace_slug, title, style, layer_name, extra) {
                Ext.create('Ext.window.Window', {
                    modal: true,
                    title: title,
                    width: 600,
                    height: 600,
		    autoScroll: true,
		    constrainHeader: true,
                    items: [{
                        flex:1,
                        title: null,
                        xtype: "mapportlet",
			height: 500,
			width: '100%',		
                        initZoomOnRender: false,
                        plugins:[],
                        extent: new OpenLayers.Bounds(
                            Lizard.CM.getContext().init_zoom[0],
                            Lizard.CM.getContext().init_zoom[1],
                            Lizard.CM.getContext().init_zoom[2],
                            Lizard.CM.getContext().init_zoom[3]
                        ),
                        autoLoadWorkspaceStore: {
                            object_slug: workspace_slug
                        },
                        init_workspace: false,
                        workspaceStore: Lizard.store.WorkspaceStore.get_or_create('popup_' + workspace_slug + Ext.id()),
                        listeners: {
                            afterRender: function() {
                                var me = this;
                                //me.callParent(arguments)
                                me.setLoading(true);
                                if (!this.init_workspace && this.autoLoadWorkspaceStore) {
                                    this.workspaceStore.load({
                                        params: me.autoLoadWorkspaceStore
                                    });
                                    this.init_workspace = true
                                }
                                Ext.Ajax.request({
                                     url: '/area/api/area_special/'+ Lizard.CM.getContext().object.id +'/',
                                     method: 'GET',
                                     params: {
                                         _accept: 'application/json'
                                     },
                                     success: function(xhr) {
                                         var area_data = Ext.JSON.decode(xhr.responseText).area;
                                         me.default_zoom = area_data.extent
                                         me.map.zoomToExtent(new OpenLayers.Bounds.fromArray(area_data.extent));
                                         return me.setLoading(false);
                                     },
                                     failure: function() {
                                         Ext.Msg.alert("portal creation failed", "Server communication failure");
                                         return me.setLoading(false);
                                     }
                                });
                            }
                        }
                    },{
                        xtype: 'image',
                        src: '/layers/wms/?FORMAT=image%2Fpng&TRANSPARENT=TRUE&STYLE='+ style + '&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&SRS=EPSG%3A900913&BBOX=460467.38252035,6800747.0720688,640132.61747965,6894993.9279312&LAYER='+ layer_name +'&width=100&height=30' + extra
                    }]
               }).show()
            },
            graph_service_url: '/graph/',
            context_manager: Lizard.CM,
            bbar: [{
                text: 'PO4 op kaart',
                handler: function (button) {
                    button.up('panel').open_map('po4_map', 'PO4 op de kaart ', 'vss_track_record_PO4', 'vss:vss_track_records', '&CQL_FILTER=parameter_ident%3D\'PO4.bodem\'')
                }
            },{
                text: 'P op kaart',
                handler: function (button) {
                    button.up('panel').open_map('p_map', 'P op de kaart ', 'vss_track_record_Ptot', 'vss:vss_track_records', '&CQL_FILTER=parameter_ident%3D\'Ptot.bodem\'')
                }
            },{
            text: 'AqMad op kaart',
            handler: function (button) {
                button.up('panel').open_map('aqmad_map', 'AqMad op de kaart ', 'vss_aqmad_Ptot', 'vss:vss_track_records', '&CQL_FILTER=parameter_ident%3D\'Ptot.z-score.water\'')
            }
        }],
            graphs: {% get_portal_template graphs-esf %}
        }
	}]
}
