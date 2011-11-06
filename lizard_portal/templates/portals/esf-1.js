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
            name: 'ESF overzicht',
            link: 'esf-overzicht'
        },
        {
            name: 'ESF 1: Belasting'
        }
    ],
	items: [{
		width:500,
		items: [{
            flex:2,
            title: 'Opbouw ESF 1',
            closable: false,
            items: {
                flex: 1,
                xtype: 'esf_grid'
            }
        }]
	},{
        flex:1,
        items: {
            title: 'Grafieken',
            id: 'bbbb',
            flex: 1,
            xtype: 'multigraph',
            graph_service_url: '/map/adapter/adapter_fewsnorm/image/',
            adapter_layer_json: {module_id:null,parameter_id:"ALMR110","fews_norm_source_slug":""},
            graphs: [{
                title: 'Belasting',
                timeseries:[{
                    parameter_id: "ALMR110",
                    module_id: "ImportLE",
                    ident: "53R0017"
                }]
            }, {
                title: 'Verblijftijd',
                timeseries:[{
                    parameter_id: "ALMR110",
                    module_id: "ImportLE",
                    ident: "53R0017"
                }]
            }, {
                title: 'P/N ratio',
                timeseries:[{
                    parameter_id: "ALMR110",
                    module_id: "ImportLE",
                    ident: "53R0017"
                }]
            }]
        }
	}]
}