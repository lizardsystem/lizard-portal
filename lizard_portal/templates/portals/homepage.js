/**
 * Created by PyCharm.
 * User: bastiaanroos
 * Date: 18-10-11
 * Time: 15:33
 * To change this template use File | Settings | File Templates.
 */
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
		items: [{
			title: 'Gebiedsinformatie',
            flex:1,

            plugins: [
                'applycontext'
            ],
            autoScroll: true,
            loader: {
                ajaxOptions: {
                    method: 'GET'
                },
                loadMask: true,
                url: '/portal/configuration/',
                autoLoad: false,
                 baseParams: {
                     _accept: 'text/html',
                     portalTemplate: 'eigenschappen'
                 }
            },
            //xtype: "image",
            applyParams: function(params) {
                 var me = this;
                 me.getLoader().load({
                     url: '/portal/configuration/',
                     params: {
                         object_id: params.object_id
                     }
                 });
            }

		},{
			title: 'Communique',
            bodyCls: 'l-grid',
            height: 150,
            //flex:1,
            collapsed: true,
            autoScroll: true,
            plugins: [
                'applycontext'
            ],
            loader: {
                ajaxOptions: {
                    method: 'GET'
                },
                loadMask: true,
                url: '/portal/configuration/',
                autoLoad: false,
                baseParams: {
                    _accept: 'text/html',
                    portalTemplate: 'communique'
                }
            },
            applyParams: function(params) {
                var me = this;
                me.getLoader().load({
                    url: '/portal/configuration/',
                    params: {
                        object_id: params.object_id
                    }
                });

            },
            tools: [{
                type: 'save',
                handler: function(e, target, panelHeader, tool){
                       var portlet = panelHeader.ownerCt;
                        var a = portlet.html;

                            var form_window = Ext.create('Ext.window.Window', {
                                title: 'Bewerk communique',
                                width: 400,
                                height: 300,
                                items: {
                                    xtype: 'form',
                                    url: '/area/api/area_communique/',
                                    layout: 'anchor',
                                    height: '100%',
                                    defaults: {
                                        anchor: '100%'
                                    },
                                    items: [{
                                        xtype: 'hiddenfield',
                                        name: 'object_id',
                                        value: Ext.getCmp('portalWindow').context_manager.getContext().object_id
                                    },{
                                        xtype: 'textareafield',
                                        //fieldLabel: 'First Name',
                                        height: '100%',
                                        name: 'communique',
                                        value: portlet.html,
                                        allowBlank: false
                                    }],
                                    buttons: [{
                                            text: 'Reset',
                                            handler: function(button, ev) {
                                                console.log(arguments)
                                                button.up('form').getForm().reset();
                                            }
                                        }, {
                                            text: 'Submit',
                                            formBind: true, //only enabled once the form is valid
                                            //disabled: true,
                                            handler: function() {
                                                var form = this.up('form').getForm();
                                                if (form.isValid()) {
                                                    form.submit({
                                                        success: function(form, action) {
                                                            console.log('Opslaan gelukt');
                                                            Ext.getCmp('communique').applyParams({
                                                                   object_id: Ext.getCmp('portalWindow').context_manager.getContext().object_id
                                                            });
                                                            form.owner.up('window').close();

                                                        },
                                                        failure: function(form, action) {
                                                            Ext.Msg.alert('Failed', 'Opslaan mislukt');
                                                        }
                                                    });
                                                }
                                            }
                                        }]
                                }
                           }).show()
                    }
             }]
		},{
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
            height: 250,
            defaults:{
                width:150,
                xtype:'button',
                margin: 2
            },
            items:[{
                    text: 'Ecologische sleutelfactoren',
                    handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'esf-overzicht'}); }
                }, {
                   text: 'Waterbalansen',
                   handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'waterbalans'}); }
                }, {
                   text: 'Analyse interpretaties',
                   handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'analyse-interpretatie'}); }
                }, {
                   text: 'Advies',
                   handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'advies'}); }
                }, {
                   text: 'Maatregelen',
                   handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'maatregelen'}); }
                }, {
                   text: 'Toestand',
                   handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'toestand-aan-afvoergebied'}); }
                }, {
                   text: 'Toevoegen analyse interpretatie',
                   handler: function() {
                       Ext.create('Ext.window.Window', {
                            title: 'Analyse interpretatie',
                            width: 800,
                            height: '60%',
                            analyseinterpretatiepopup: true,
                            //autoScroll: true,
                            loader:{
                                loadMask: true,
                                autoLoad: true,
                                url: '/portal/configuration/',
                                ajaxOptions: {
                                    method: 'GET'
                                },
                                params: {
                                    portalTemplate: 'analyse_interpretatie_form'
                                },
                                renderer: 'component'
                            }
                        }).show();
                   }
                }
            ]
 		},{
			title: 'Gerelateerde deelgebieden',
            flex:1,
            autoScroll:true,
            layout: {
                type: 'table',
                columns:1
            },
            defaults:{
                width:150,
                xtype:'button'
            },
            items:[
                {% if area.parent %}
                {
                    text: '{{area.parent.name}}',
                    handler: function() { Ext.getCmp('portalWindow').linkTo({area:"{{ area.parent.ident }}" }); }
                },
                {% endif %}

                {% for a in area.get_children %}
                {
                    text: '{{a.name}}',
                    handler: function() { Ext.getCmp('portalWindow').linkTo({area:"{{ a.ident }}" }); }
                },
                {% endfor %}
            ]
		}]
       }]
}