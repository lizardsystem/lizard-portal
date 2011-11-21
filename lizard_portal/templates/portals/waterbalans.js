/**
 * Created by PyCharm.
 * User: bastiaanroos
 * Date: 19-10-11
 * Time: 17:52
 * To change this template use File | Settings | File Templates.
 */
{
    itemId: 'waterbalans',
    title: 'Waterbalans',
	xtype: 'portalpanel',
    breadcrumbs: [{
            name: 'watersysteemkaart',
            link: 'homepage'
        },
        {
            name: 'Waterbalans'
        }
    ],
	items:[{
		width: 300,
		items: [{
			title: 'Info',
            flex:1,
			html: 'Hier komt het overzicht'
		},{
			title: 'Instellingen',
            height: 150,
            bbar: [{
                    xtype: 'button',
                    text: 'configuratie',
                    iconCls: 'setting',
                    handler: function(menuItem, checked) {
                        Ext.getCmp('portalWindow').linkTo({portalTemplate:'waterbalans-configuratie'});
                    }
                }]
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
                title: 'Waterbalans met sluitfout',
                timeseries:[{
                    parameter_id: "ALMR110",
                    module_id: "ImportLE",
                    ident: "53R0017"
                }]
            },{
                title: 'Fracties en choride concentratie',
                timeseries:[{
                    parameter_id: "ALMR110",
                    module_id: "ImportLE",
                    ident: "53R0017"
                }]
            },{
                title: 'Waterstand met sluitfout',
                timeseries:[{
                    parameter_id: "ALMR110",
                    module_id: "ImportLE",
                    ident: "53R0017"
                }]
            }, {
                title: 'Cumulatieve debieten',
                timeseries:[{
                    parameter_id: "ALMR110",
                    module_id: "ImportLE",
                    ident: "53R0017"
                }]
            }, {
                title: 'Fosfaatbelasting',
                timeseries:[{
                    parameter_id: "ALMR110",
                    module_id: "ImportLE",
                    ident: "53R0017"
                }]
            }]
		}]
	}]
}
