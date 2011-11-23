{
    itemId: 'toestand-aan-afvoergebied',
    title: 'Toestand',
    breadcrumbs: [
        {
            name: 'watersysteemkaart'

        },
        {
            name: 'Toestand'

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
            flex:1,
            layout:'card',
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

            }
        },
        {
            title: 'ESF-scores',
            html: 'esf scores (GS300)',
            flex:1
        }]

    },{
		flex: 1,
		items: [{
			title: 'Grafieken',
            flex: 1,
            xtype: 'multigraph',
            graph_service_url: '/map/adapter/adapter_fewsnorm/image/',
            adapter_layer_json: {module_id:null,parameter_id:"ALMR110","fews_norm_source_slug":""},
            graphs: [{
                title: 'Stuurparameter 1',
                timeseries:[{
                    parameter_id: "ALMR110",
                    module_id: "ImportLE",
                    ident: "53R0017"
                }]
            },{
                title: 'Stuurparameter 2',
                timeseries:[{
                    parameter_id: "ALMR110",
                    module_id: "ImportLE",
                    ident: "53R0017"
                }]
            },{
                title: 'Stuurparameter 3',
                timeseries:[{
                    parameter_id: "ALMR110",
                    module_id: "ImportLE",
                    ident: "53R0017"
                }]
            }, {
                title: 'Maatregelen',
                timeseries:[{
                    parameter_id: "ALMR110",
                    module_id: "ImportLE",
                    ident: "53R0017"
                }]
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

