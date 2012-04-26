{% load get_portal_template %}
{
    itemId: 'toestand-aan-afvoergebied',
    title: 'Toestand',
    breadcrumbs: [
        {
            name: 'watersysteemkaart',
            link: 'homepage'
        },
        {
            name: 'Toestand'
        }
    ],
	xtype: 'portalpanel',
	items: [{
    	width: 200,
		items: [
            {% get_portal_template gebiedseigenschappen %},
            {% get_portal_template communique %}

        ]
    },{
		flex: 1,
		items: [{
            title: 'Grafieken',
            flex: 1,
            xtype: 'multigraphstore',
            applyParams: function(params) {
                var me = this;
                me.store.load({
                    params: {
                        object_id: params.object.id
                    }
                });
            },
            plugins: [
                'applycontext'
            ],
            store: Ext.create('Lizard.store.Graph',{
                storeId: 'toestand_store',
                context_ready: true,
                proxy: {
                    type: 'ajax',
                    url: '/measure/api/steer_parameter_graphs/',
                    extraParams: {
                          _accept: 'application/json'
                    },
                    reader: {
                          //root: 'data',
                          type: 'json'
                    }
                }
            }),
            tools: [{
                type: 'save',
                handler: function (e, target, panelHeader, tool) {
                    var cm = Ext.getCmp('portalWindow').context_manager.getContext();

                    Ext.create('Ext.window.Window', {
                        title: 'Stuurparameters instellen',
                        width: 800,
                        height: 600,
                        modal: true,
                        listeners: {
                            close: function() {
                                var store = Ext.StoreManager.lookup('toestand_store');
                                store.load();
                            }
                        },
                        editpopup: true,
                        loader:{
                            loadMask: true,
                            autoLoad: true,
                            url: '/measure/steering_parameter_form/',
                            params: {
                                object_id: cm.object.id
                            },
                            ajaxOptions: {
                                method: 'GET'
                            },
                            renderer: 'component'
                        }
                    }).show();
                }
            }]
        }]
    },
    {
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
                    handler: function() { Lizard.CM.setContext({portal_template:'esf-1'}); }
                }, {
                   text: 'Waterbalansen',
                   icon: '/static_media/vss/icons/waterbalansen.png',
                   handler: function() { Lizard.CM.setContext({portal_template:'waterbalans'}); }
                }, {
                   text: 'Analyse interpretaties',
                   icon: '/static_media/vss/icons/advies.png',
                   handler: function() { Lizard.CM.setContext({portal_template:'analyse-interpretatie'}); }
                }, {
                   text: 'Geschikte maatregelen',
                   icon: '/static_media/vss/icons/gebiedsinformatie.png',
                   handler: function() { Lizard.CM.setContext({portal_template:'advies'}); }
                }, {
                   text: 'Maatregelen',
                   icon: '/static_media/vss/icons/maatregelen.png',
                   handler: function() { Lizard.CM.setContext({portal_template:'maatregelen'}); }
                }, {
                   text: 'Watersysteemkaart',
                   //icon: '/static_media/vss/icons/toestand.png',
                   handler: function() { Lizard.CM.setContext({portal_template:'homepage'}); }
                }
            ]
 		},
        {% get_portal_template esf-overzicht %},
        {% get_portal_template gebieden_links %}
        ]
    }]
}

