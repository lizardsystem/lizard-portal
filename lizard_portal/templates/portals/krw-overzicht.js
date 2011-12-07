/**
 * Created by PyCharm.
 * User: bastiaanroos
 * Date: 19-10-11
 * Time: 17:52
 * To change this template use File | Settings | File Templates.
 */
{
    itemId: 'krw-overzicht',
    title: 'KRW overzicht',
	xtype: 'portalpanel',
    breadcrumbs: [
    {
        name: 'KRW-overzicht'
    }],
	items:[{
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
        },{
			title: 'Extra info?',
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
                title: 'EKR scores',
                timeseries:[{
                    parameter_id: "ALMR110",
                    module_id: "ImportLE",
                    ident: "53R0017"
                }]
            }, {
                title: 'Maatregel voortgang',
                timeseries:[{
                    parameter_id: "ALMR110",
                    module_id: "ImportLE",
                    ident: "53R0017"
                }]
            }]
		}]
	}]
}
