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
            {% get_portal_template communique %},
            {% get_portal_template esf-overzicht %}
        ]
    },{
		flex: 1,
		items: [{
            title: 'Grafieken',
            flex: 1,
            xtype: 'multigraphstore',
            store: Ext.create('Lizard.store.Graph', {data: {% get_portal_template graphs-aanafvoer_toestand %} })
		}],
        tools: [{
            type: 'save',
            handler: function (e, target, panelHeader, tool) {
                var cm = Ext.getCmp('portalWindow').context_manager.getContext();

                Ext.create('Ext.window.Window', {
                    title: 'Stuurparameters instellen',
                    width: 800,
                    height: 600,
                    modal: true,
                    finish_edit_function: function (updated_record) {
                        //todo
                    },
                    editpopup: true,

                    loader:{
                        loadMask: true,
                        autoLoad: true,
                        url: '/measure/steering_parameter_form/',
                        params: {
                            object_id: cm.object_id
                        },
                        ajaxOptions: {
                            method: 'GET'
                        },
                        renderer: 'component'
                    }
                }).show();
            }
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
                   text: 'Maatregelen',
                   handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'maatregelen'}); }
                }, {
                   text: 'Watersysteemkaart',
                   handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'homepage'}); }
                }
            ]
 		},
        {% get_portal_template gebieden_links %}
        ]
    }]
}

