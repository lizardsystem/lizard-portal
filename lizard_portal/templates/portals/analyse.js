{% load get_portal_template %}

{
    itemId: 'analyse',
    title: 'Analyse scherm',
    xtype: 'portalpanel',
    items:[{
	width: 300,
	items: [{
	    title: 'Navigatie',
            flex:2,
            xtype: 'appscreenportlet',
            store: Ext.create('Lizard.store.AppScreen', {data: [
                {slug: 'app1', name: 'N&S', description: 'app1 description',
                 type: 'external', url: 'http://www.nelen-schuurmans.nl'},
                {slug: 'app2', name: 'Lizard', description: 'app2 description',
                 type: 'external', url: 'http://lizard.net'},
            ] })
	},{
        autoHeight: true,
        minHeight: 200,
	    title: 'Workspace',
            //id: 'kaartlagen',

            xtype: 'grid',
            columns:[{
                text: 'aan',
                width:35,
                dataIndex: 'visibility',
                xtype: 'checkcolumn',
                sortable: true
            },{
                text: 'Naam',
                flex: 1,
                sortable: true,
                dataIndex: 'title'
            }],
            store: Ext.data.StoreManager.lookup('Workspace'),
            tools: [{
                type: 'save',
                handler: function(e, target, panelHeader, tool) {
                    var portlet = panelHeader.ownerCt;
                    var a = portlet.html;

                    var form_window = Ext.create('Ext.window.Window', {
                        title: 'Save workspace',
                        width: 400,
                        height: 300
                    }).show();
                }
            }]
  	}
               ]
    },{
	flex: 1,
		items: [{
			title: 'Kaart',
            id:'extmap_analyse',
            plugins: [
                'applycontext'
            ],
            flex:1,
            xtype: "gx_mappanel",
            initZoomOnRender: false,
            controls: [new OpenLayers.Control.LayerSwitcher()
            ],
            layers: Ext.data.StoreManager.lookup('Workspace'),
            onMapClick: function (event) {

                layerlist = "here,there,everywhere";

                var mouseLoc = this.map.getLonLatFromPixel(event.xy);
                var layer_switcher = Ext.getCmp('kaartlagen')
                var selected_layers  = layer_switcher.getSelectionModel().selected
                if (selected_layers.length != 0) {
                    var layer = selected_layers.first().data.layer;
                    console.log(layer);

                    var url = layer.getFullRequestString({
                                namespace: 'inspire',
                                REQUEST: "GetFeatureInfo",
                                EXCEPTIONS: "application/vnd.ogc.se_xml",
                                BBOX: this.map.getExtent().toBBOX(),
                                X: event.xy.x,
                                Y: event.xy.y,
                                //X: mouseLoc.X,
                                //Y: mouseLoc.Y,
                                INFO_FORMAT: 'text/html',
                                QUERY_LAYERS: layer.params.LAYERS[0],
                                LAYERS: layer.params.LAYERS[0],
                                FEATURE_COUNT: 1,
                                WIDTH: this.map.size.w,
                                HEIGHT: this.map.size.h
                        },
                                layer.url);

                    console.log(url);

                    var windows = Ext.WindowManager.getBy(function(obj) {
                        if (obj.mappopup == true && obj.pin == false) {
                            return true;
                        } else {
                            return false;
                        }
                    });

                    if (windows.length == 0) {

                        Ext.create('Ext.window.Window', {
                                title: 'object_info',
                                width: 400,
                                height: 300,
                                collapsable: true,
                                //TODO: move styling to CSS
                                bodyStyle: {
                                    background: '#ffffff',
                                    padding: '10px'
                                },
                                mappopup: true,
                                pin: false,
                                //layout: 'fit',
                                tools:[{
                                    type: 'unpin',
                                    handler: function(e, target, panelHeader, tool) {
                                        var window = panelHeader.ownerCt;
                                        if (tool.type == 'pin') {
                                            tool.setType('unpin');
                                            window.pin = false;

                                        } else {
                                            tool.setType('pin');
                                            window.pin = true;
                                        }
                                    }
                                }],
                                autoScroll: true,
                                loader:{
                                    loadMask: true,
                                    autoLoad: true,
                                    url: '/portal/getFeatureInfo/',
                                    ajaxOptions: {
                                        method: 'GET'
                                    },
                                    params: {
                                        request: Ext.JSON.encode(url)
                                    },
                                    renderer: 'html'
                                }
                            }
                        ).show();
                    } else {
                        console.log('reuse window');
                        windows[0].loader.params = {
                                        request: Ext.JSON.encode(url)
                                    }
                        windows[0].loader.load();
                        Ext.WindowManager.bringToFront(windows[0]);
                    }
                } else {
                    Ext.MessageBox.show({
                        title: 'Feature info',
                        msg: 'Selecteer links eerst een kaartlaag door op de naam te klikken',
                        buttons: Ext.MessageBox.OK
                    });
                }
            },
            applyParams: function(params) {
                var me = this;
                me.setLoading(true);
                Ext.Ajax.request({
                    url: '/area/api/area_special/'+ params.object.id +'/',
                    method: 'GET',
                    params: {
                        _accept: 'application/json'
                    },
                    success: function(xhr) {
                        var area_data = Ext.JSON.decode(xhr.responseText).area;
                        me.map.zoomToExtent(new OpenLayers.Bounds.fromArray(area_data.extent));
                        return me.setLoading(false);
                    },
                    failure: function() {
                        Ext.Msg.alert("portal creation failed", "Server communication failure");
                        return me.setLoading(false);
                    }
                });
            },
            rbar:[{
                    //text: 'ESF',
                    icon: '/static_media/vss/icons/esf.png',
                    handler: function() { Ext.getCmp('portalWindow').linkToNewWindow({portal_template:'esf-1'}); }
                }, {
                   //text: 'WB',
                   icon: '/static_media/vss/icons/waterbalansen.png',
                   handler: function() { Ext.getCmp('portalWindow').linkToNewWindow({portal_template:'waterbalans'}); }
                },/* {
                   text: 'AI',
                   handler: function() { Ext.getCmp('portalWindow').linkToNewWindow({portalTemplate:'analyse-interpretatie'}); }
                }, {
                   text: 'Advies',
                   handler: function() { Ext.getCmp('portalWindow').linkToNewWindow({portalTemplate:'advies'}); }
                },*/ {
                   //text: 'Maatr',
                   icon: '/static_media/vss/icons/maatregelen.png',
                   handler: function() { Ext.getCmp('portalWindow').linkToNewWindow({portal_template:'maatregelen'}); }
                }, {
                   text: 'Tsnd',
                   handler: function() { Ext.getCmp('portalWindow').linkToNewWindow({porta_template:'toestand-aan-afvoergebied'}); }
                }],
            flex:1
		}]
	}]
}
