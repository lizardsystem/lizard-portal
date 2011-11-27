{% load get_grid %}


{
    itemId: 'waterbalans-configuratie',
    title: 'Waterbalans-configuratie',
	xtype: 'portalpanel',
    breadcrumbs: [{
            name: 'watersysteemkaart',
            link: 'homepage'
        },
        {
            name: 'waterbalans',
            link: 'waterbalans'
        },
        {
            name: 'waterbalans-configuratie'
        }
    ],


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
                            this.store.getProxy().url = '/wbconfiguration/api/area_configuration/'
                            this.store.applyParams({object_id: params.object_id,
                                                    grid_name: 'area'});
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
                            this.store.getProxy().url = '/wbconfiguration/api/area_configuration/'
                            this.store.applyParams({object_id: params.object_id,
                                                    grid_name: 'water'});
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
                        this.store.applyParams({object_id: params.object_id,
                                                area_object_type: 'Bucket'});
                        this.store.load();
                    }
                },
                //proxyUrl: '/portal/wbbuckets.json',
                proxyUrl: '/wbconfiguration/api/area_object_configuration/',
                dataConfig:[
                    {name: 'id', title: 'id', editable: true, visible: true, width: 100},
                    {name: 'name', title: 'name', editable: true, visible: true, width: 100},
                    {name: 'surface', title: 'surface', editable: true, visible: true, width: 100},
                    {name: 'area', title: 'Gebied', editable: true, visible: true, width: 100},
                    {name: 'bottom_crop_evaporation_factor', title: 'bottom_crop_evaporation_factor', editable: true, visible: true, width: 100},
                    {name: 'bottom_drainage_fraction', title: 'bottom_drainage_fraction', editable: true, visible: true, width: 100},
                    {name: 'bottom_indraft_fraction', title: 'bottom_indraft_fraction', editable: true, visible: true, width: 100},
                    {name: 'bottom_init_water_level', title: 'bottom_init_water_level', editable: true, visible: true, width: 100},
                    {name: 'bottom_max_water_level', title: 'bottom_max_water_level', editable: true, visible: true, width: 100},
                    {name: 'bottom_min_crop_evaporation_factor', title: 'bottom_min_crop_evaporation_factor', editable: true, visible: true, width: 100},
                    {name: 'bottom_min_water_level', title: 'bottom_min_water_level', editable: true, visible: true, width: 100},
                    {name: 'bottom_porosity', title: 'bottom_porosity', editable: true, visible: true, width: 100},
                    {name: 'bucket_type', title: 'bucket_type', editable: true, visible: true, width: 100},
                    {name: 'code', title: 'code', editable: true, visible: true, width: 100},
                    {name: 'concentr_chloride_drainage_indraft', title: 'concentr_chloride_drainage_indraft', editable: true, visible: true, width: 100},
                    {name: 'concentr_chloride_flow_off', title: 'concentr_chloride_flow_off', editable: true, visible: true, width: 100},
                    {name: 'crop_evaporation_factor', title: 'crop_evaporation_factor', editable: true, visible: true, width: 100},
                    {name: 'drainage_fraction', title: 'drainage_fraction', editable: true, visible: true, width: 100},
                    {name: 'incr_concentr_nitrogen_drainage_indraft', title: 'incr_concentr_nitrogen_drainage_indraft', editable: true, visible: true, width: 100},
                    {name: 'incr_concentr_nitrogen_flow_off', title: 'incr_concentr_nitrogen_flow_off', editable: true, visible: true, width: 100},
                    {name: 'incr_concentr_phosphate_drainage_indraft', title: 'incr_concentr_phosphate_drainage_indraft', editable: true, visible: true, width: 100},
                    {name: 'incr_concentr_phosphate_flow_off', title: 'incr_concentr_phosphate_flow_off', editable: true, visible: true, width: 100},
                    {name: 'indraft_fraction', title: 'indraft_fraction', editable: true, visible: true, width: 100},
                    {name: 'init_water_level', title: 'init_water_level', editable: true, visible: true, width: 100},
                    {name: 'is_computed', title: 'is_computed', editable: true, visible: true, width: 100},
                    {name: 'kwelwegz', title: 'kwelwegz', editable: true, visible: true, width: 100},
                    {name: 'kwelwegz_is_ts', title: 'kwelwegz_is_ts', editable: true, visible: true, width: 100},
                    {name: 'label_drainaige_indraft', title: 'label_drainaige_indraft', editable: true, visible: true, width: 100},
                    {name: 'label_flow_off', title: 'label_flow_off', editable: true, visible: true, width: 100},
                    {name: 'man_water_level', title: 'man_water_level', editable: true, visible: true, width: 100},
                    {name: 'min_concentr_nitrogen_drainage_indraft', title: 'min_concentr_nitrogen_drainage_indraft', editable: true, visible: true, width: 100},
                    {name: 'min_concentr_nitrogen_flow_off', title: 'min_concentr_nitrogen_flow_off', editable: true, visible: true, width: 100},
                    {name: 'min_concentr_phosphate_drainage_indraft', title: 'min_concentr_phosphate_drainage_indraft', editable: true, visible: true, width: 100},
                    {name: 'min_concentr_phosphate_flow_off', title: 'min_concentr_phosphate_flow_off', editable: true, visible: true, width: 100},
                    {name: 'min_crop_evaporation_factor', title: 'min_crop_evaporation_factor', editable: true, visible: true, width: 100},
                    {name: 'min_water_level', title: 'min_water_level', editable: true, visible: true, width: 100},
                    {name: 'porosity', title: 'porosity', editable: true, visible: true, width: 100},
                    {name: 'replace_impact_by_nutricalc', title: 'replace_impact_by_nutricalc', editable: true, visible: true, width: 100},
                    {name: 'ts_drainageindraft', title: 'ts_drainageindraft', editable: true, visible: true, width: 100},
                    {name: 'ts_flowoff', title: 'ts_flowoff', editable: true, visible: true, width: 100},
                    {name: 'ts_kwelwegz', title: 'ts_kwelwegz', editable: true, visible: true, width: 100},
                    {name: 'ts_referenceoverflow', title: 'ts_referenceoverflow', editable: true, visible: true, width: 100},
                    {name: 'deleted', title: 'Deleted', editable: true, visible: true, width: 100}
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
                        this.store.load({params: {object_id: params.object_id,
                                                  area_object_type: 'Structure'}});
                    }
                },
                //proxyUrl: '/portal/wbstructures.json',
                proxyUrl: '/wbconfiguration/api/area_object_configuration/',
                proxyParams: {},
                dataConfig:[
                    {name: 'name', title: 'name', editable: true, visible: true, width: 100},
                    {name: 'code', title: 'code', editable: true, visible: true, width: 100},
                    {name: 'in_out', title: 'in_out', editable: true, visible: true, width: 100},
                    {name: 'area', title: 'area', editable: true, visible: true, width: 100},
                    {name: 'concentr_chloride', title: 'concentr_chloride', editable: true, visible: true, width: 100},
                    {name: 'deb_is_ts', title: 'deb_is_ts', editable: true, visible: true, width: 100},
                    {name: 'deb_wint', title: 'deb_wint', editable: true, visible: true, width: 100},
                    {name: 'deb_zomer', title: 'deb_zomer', editable: true, visible: true, width: 100},
                    {name: 'id', title: 'id', editable: true, visible: true, width: 100},
                    {name: 'incr_concentr_nitrogen', title: 'incr_concentr_nitrogen', editable: true, visible: true, width: 100},
                    {name: 'incr_concentr_phosphate', title: 'incr_concentr_phosphate', editable: true, visible: true, width: 100},
                    {name: 'is_computed', title: 'is_computed', editable: true, visible: true, width: 100},
                    {name: 'min_concentr_nitrogen', title: 'min_concentr_nitrogen', editable: true, visible: true, width: 100},
                    {name: 'min_concentr_phosphate', title: 'min_concentr_phosphate', editable: true, visible: true, width: 100},
                    {name: 'ts_debiet', title: 'ts_debiet', editable: true, visible: true, width: 100},
                    {name: 'deleted', title: 'Deleted', editable: true, visible: true, width: 100}
                ]
            }]
		}]
	}]
}
