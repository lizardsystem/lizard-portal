{% load get_grid %}


{
    itemId: 'waterbalans-configuratie',
    title: 'Waterbalans-configuratie',
	xtype: 'portalpanel',
	items:[{
		flex:1,
		items: [{
			title: 'Instellingen',
            flex:1,
            width: '100%',
            layout:{
                type: 'anchor',
                columns:2
            },
            autoScroll:true,
            items:[{
                anchor: "100%",
                height: 300,
                layout:{
                    type: 'hbox'

                },
                defaults: {
                    padding: 5
                },

                items:[
                    {
                        title: 'Gebied eigenschappen',
                        width: 400, //flex:1,
                        //anchor:'50% 400',
                        xtype: 'leditpropgrid',
                        height:200,
                        proxyUrl: '/wbconfiguration/api/area_configuration/',
                        proxyParams: {
                            _accept: 'application/json'
                        },
                        plugins: [
                            'applycontext'
                        ],
                        applyParams: function(params) {
                            var url = '/wbconfiguration/api/area_configuration/';
                            url = url + params.object_id + '/area/';
                            this.store.getProxy().url = url;
                            this.store.load();
                        },
                        store: Ext.create('Vss.store.WaterbalanceAreaConfig')
                    },{
                        title: 'Openwater',
                        width:400,
                        id: 'openw',
                        height:200,
                        xtype: 'leditpropgrid',
                        plugins: [
                            'applycontext'
                        ],
                        proxyUrl: '/wbconfiguration/api/area_configuration/',
                        proxyParams: {
                            _accept: 'application/json'
                        },
                        applyParams: function(params) {
                            var url = '/wbconfiguration/api/area_configuration/';
                            url = url + params.object_id + '/water/';
                            this.store.getProxy().url = url;
                            this.store.load();
                        },
                        store: Ext.create('Vss.store.WaterbalanceWaterConfig')
                    }]
                },
                {
                title: 'Bakjes',
                //height:400,
                anchor:'100%',
                height: 200,
                xtype: 'leditgrid',
                plugins: [
                    'applycontext'
                ],
                applyParams: function(params) {
                    var params = params|| {};

                    if (this.store) {
                        this.store.load({params: {object_id: params.object_id}});
                    }
                },
                //proxyUrl: '/portal/wbbuckets.json',
                proxyUrl: '/wbconfiguration/api/bucket_configuration/',
                dataConfig:[
                    {name: 'id', title: 'id', mapping: 'id', editable: false, visible: true, width:100 },
                    {name: 'name', title: 'Naam', mapping: 'name', editable: true, visible: true, width:100 },
                    {name: 'area', title: 'Ident', mapping: 'area_id', editable: false, visible: true, width:100 },
                    {name: 'surface', title: 'Oppervlakte', mapping: 'surface', editable: true, visible: false, width:100 },
                    {name: 'kwelwegz_is_ts', title: 'Kwelwegz', mapping: 'kwelwegz_is_ts', editable: true, visible: false, width:100 }
                ]

            },{
                title: 'Kunstwerken',
                anchor:'100%',
                height: 200,
                xtype: 'leditgrid',
                plugins: [
                    'applycontext'
                ],
                applyParams: function(params) {
                    var params = params|| {};
                    console.log('apply params');
                    console.log(params);

                    if (this.store) {
                        this.store.load({params: {object_id: params.object_id}});
                    }
                },
                proxyUrl: '/portal/wbstructures.json',
                proxyParams: {},
                dataConfig:[
                    {name: 'id', title: 'id', mapping: 'id', editable: false, visible: true, width:100 },
                    {name: 'name', title: 'name', mapping: 'name', editable: false, visible: true, width:100 },
                    {name: 'c', title: 'F', mapping: 'c', editable: true, visible: false, width:100 },
                    {name: 'd', title: 'G', mapping: 'd', editable: false, visible: false, width:100 }
                ]
            }]
		}]
	}]
}
