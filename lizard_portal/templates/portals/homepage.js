/**
 * Created by PyCharm.
 * User: bastiaanroos
 * Date: 18-10-11
 * Time: 15:33
 * To change this template use File | Settings | File Templates.
 */
{% load get_portal_template %}

{
    itemId: 'homepage',
    title: 'Watersysteemkaart',
    breadcrumbs: [
        {
            name: 'watersysteemkaart'
        }
    ],
	xtype: 'portalpanel',
	items: [{
		width: 300,
		items: [
            {% get_portal_template gebiedseigenschappen %},
            {% get_portal_template communique %},
        {
            flex:2,
			title: 'Kaartlagen',
            id: 'kaartlagen',
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
            store: Ext.data.StoreManager.lookup('Layers')
		}]
	},{
		flex: 1,
		items: [{
			title: 'Watersysteemkaart',
            id:'extmap',
            plugins: [
                'applycontext'
            ],
            flex:1,
            xtype: "gx_mappanel",
            initZoomOnRender: false,
            controls: [new OpenLayers.Control.LayerSwitcher()
            ],
            layers: Ext.data.StoreManager.lookup('Layers'),
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
                    url: '/area/api/area_special/'+ params.object_id +'/',
                    method: 'GET',
                    params: {
                        _accept: 'application/json'
                    },
                    success: function(xhr) {
                        var area_data = Ext.JSON.decode(xhr.responseText).area;
                        console.log(area_data)
                        me.map.zoomToExtent(new OpenLayers.Bounds.fromArray(area_data.extent));

                        return me.setLoading(false);
                    },
                    failure: function() {
                        Ext.Msg.alert("portal creation failed", "Server communication failure");
                        return me.setLoading(false);
                    }
                });
            }
		}]
	},{
		width: 200,
		items: [{
            title: 'Links van dit gebied',

            layout: {
                type: 'table',
                columns:1
            },
            height: 200,
            defaults:{
                width:160,
                xtype:'button',
                margin: 3
            },
            items:[{
                    text: 'Ecologische sleutelfactoren',
                    icon: '/static_media/vss/icons/esf.png',
                    handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'esf-1'}); }
                }, {
                   text: 'Waterbalansen',
                   icon: '/static_media/vss/icons/waterbalansen.png',
                   handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'waterbalans'}); }
                }, {
                   text: 'Analyse interpretaties',
                   icon: '/static_media/vss/icons/advies.png',
                   handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'analyse-interpretatie'}); }
                }, {
                   text: 'Geschikte maatregelen',
                   icon: '/static_media/vss/icons/gebiedsinformatie.png',
                   handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'advies'}); }
                }, {
                   text: 'Maatregelen',
                   icon: '/static_media/vss/icons/maatregelen.png',
                   handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'maatregelen'}); }
                }, {
                   text: 'Toestand',
                   icon: '/static_media/vss/icons/toestand.png',
                   handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'toestand-aan-afvoergebied'}); }
                }

            ]
 		},
        {% get_portal_template esf-overzicht %},
        {% get_portal_template gebieden_links %}
       ]
    }]
}
