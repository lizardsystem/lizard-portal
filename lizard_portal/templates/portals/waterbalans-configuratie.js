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
            id: 'xxx',
            flex:1,
            width: '100%',
            layout:{
                type: 'anchor',
                columns:2
            },
            defaults: {
                margin: 15
            },
            autoScroll:true,
            bbar: [
                {
                    xtype: 'button',
                    text: 'Cancel',
                    iconCls: 'cancel',
                    handler: function (menuItem, checked) {
                        var panel = menuItem.up('panel');
                        var grids = panel.query('grid');
                        for (var i = 0; i < grids.length; i++) {
                            grids[i].cancelEdits()
                        }

                    }
                },
                {
                    xtype: 'button',
                    text: 'Save',
                    iconCls: 'save',
                    handler: function (menuItem) {
                        var panel = menuItem.up('panel');
                        var grids = panel.query('grid');

                        Ext.MessageBox.show({
                            title: 'Wijzigingen opslaan',
                            msg: 'Samenvatting',
                            width: 300,
                            multiline: true,
                            buttons: Ext.MessageBox.OKCANCEL,
                            fn: function(btn, text)  {
                                if (btn=='ok') {
                                    for (var i = 0; i < grids.length; i++) {
                                        grids[i].saveEdits()
                                    }
                                }
                            }
                        });

                    }
                }
            ],
            items:[{
                anchor: "100%",
                autoHeight: true,
                border: false,
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
                        useSaveBar: false,
                        xtype: 'leditpropgrid',
                        autoHeight: true,
                        proxyUrl: '/wbconfiguration/api/area_configuration/',
                        proxyParams: {
                            _accept: 'application/json',
                            grid_name: 'area'
                        },
                        plugins: [
                            'applycontext'
                        ],
                        applyParams: function(params) {
                            this.store.applyParams({object_id: params.object_id, grid_name: 'area'});
                            this.store.load();
                        },
                        store: Ext.create('Vss.store.WaterbalanceAreaConfig')
                    },{
                        title: 'Openwater',
                        width:400,
                        id: 'openw',
                        useSaveBar: false,
                        autoHeight: true,
                        xtype: 'leditpropgrid',
                        plugins: [
                            'applycontext'
                        ],
                        proxyUrl: '/wbconfiguration/api/area_configuration/',
                        proxyParams: {
                            _accept: 'application/json',
                            grid_name: 'water'
                        },
                        applyParams: function(params) {
                            this.store.applyParams({object_id: params.object_id, grid_name: 'water'});
                            this.store.load();
                        },
                        store: Ext.create('Vss.store.WaterbalanceWaterConfig')
                    }]
                },
                {
                title: 'Bakjes',
                id: 'zzz',
                //height:400,
                anchor:'100%',
                autoHeight: true,
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
                    {name: 'id', title: 'id', editable: false, visible: false, width: 100, type: 'text'},//automatisch
                    {name: 'code', title: 'code', editable: false, visible: false, width: 100, type: 'text'},//automatisch genereren
                    {name: 'area', title: 'Gebied', editable: false, visible: false, width: 100, type: 'text'},//default invullen
                    {name: 'name', title: 'Naam', editable: true, visible: true, width: 100, type: 'text'},
                    {name: 'bucket_type', title: 'Type', editable: true, visible: true, width: 100, type: 'combo', choices: ['verhard', 'gedraineerd', 'ongedraineerd', 'stedelijk']},//todo combobox, met editIf
                    {name: 'is_computed', title: 'Bereken (of opgedrukt)', editable: true, visible: true, width: 100, type: 'checkbox'},

                 //computed

                    {name: 'surface', title: 'Oppervlak [m2]', editable: true, visible: true, width: 100, type: 'number'},


                   //instellingen bovenste bakje
                    {title: 'Bovenste bakje', columns: [
                        {name: 'crop_evaporation_factor', title: 'Crop evaporatie factor', editable: true, visible: true, width: 100, type: 'number', editIf: {prop: 'bucket_type', value_in: ['gedraineerd', 'verhard', 'ongedraineerd']}},
                        {name: 'min_crop_evaporation_factor', title: 'Min crop evaporatie factor', editable: true, visible: true, width: 100, type: 'number', editIf: {prop: 'bucket_type', value_in: ['gedraineerd', 'verhard', 'ongedraineerd']}},
                        {name: 'porosity', title: 'Porositeit', editable: true, visible: true, width: 100, type: 'number', editIf: {prop: 'bucket_type', value_in: ['gedraineerd', 'verhard', 'ongedraineerd']}},
                        {name: 'drainage_fraction', title: 'Drainage fractie', editable: true, visible: true, width: 100, type: 'number', editIf: {prop: 'bucket_type', value_in: ['gedraineerd', 'verhard', 'ongedraineerd']}},
                        {name: 'indraft_fraction', title: 'Intrek fractie', editable: true, visible: true, width: 100, type: 'number', editIf: {prop: 'bucket_type', value_in: ['gedraineerd', 'verhard', 'ongedraineerd']}},
                        {name: 'init_water_level', title: 'Initiële waterniveau', editable: true, visible: false, width: 100, type: 'number', editIf: {prop: 'bucket_type', value_in: ['gedraineerd', 'verhard', 'ongedraineerd']}},
                        {name: 'man_water_level', title: 'Max waterniveau', editable: true, visible: true, width: 100, type: 'number', editIf: {prop: 'bucket_type', value_in: ['gedraineerd', 'verhard', 'ongedraineerd']}},
                        {name: 'min_water_level', title: 'Min waterniveau', editable: true, visible: true, width: 100, type: 'number', editIf: {prop: 'bucket_type', value_in: ['gedraineerd', 'verhard', 'ongedraineerd']}}
                    ]},

                    //instellingen onderste bakje
                    {title: 'Onderste bakje', columns: [
                        {name: 'bottom_crop_evaporation_factor', title: 'Crop evaporatie factor', editable: true, visible: true, width: 100, type: 'number', editIf: {prop: 'bucket_type', value_in: ['gedraineerd', 'verhard']}},
                        {name: 'bottom_min_crop_evaporation_factor', title: 'Min crop evaporatie factor', editable: true, visible: true, width: 100, type: 'number', editIf: {prop: 'bucket_type', value_in: ['gedraineerd', 'verhard']}},
                        {name: 'bottom_porosity', title: 'Porositeit', editable: true, visible: true, width: 100, type: 'number', editIf: {prop: 'bucket_type', value_in: ['gedraineerd', 'verhard']}},
                        {name: 'bottom_drainage_fraction', title: 'Drainage fractie', editable: true, visible: true, width: 100, type: 'number', editIf: {prop: 'bucket_type', value_in: ['gedraineerd', 'verhard']}},
                        {name: 'bottom_indraft_fraction', title: 'Intrek fractie', editable: true, visible: true, width: 100, type: 'number', editIf: {prop: 'bucket_type', value_in: ['gedraineerd', 'verhard']}},
                        {name: 'bottom_init_water_level', title: 'Initiële waterniveau', editable: true, visible: false, width: 100, type: 'number', editIf: {prop: 'bucket_type', value_in: ['gedraineerd', 'verhard']}},//mag weg?
                        {name: 'bottom_max_water_level', title: 'Max waterniveau', editable: true, visible: true, width: 100, type: 'number', editIf: {prop: 'bucket_type', value_in: ['gedraineerd', 'verhard']}},
                        {name: 'bottom_min_water_level', title: 'Min waterniveau', editable: true, visible: true, width: 100, type: 'number', editIf: {prop: 'bucket_type', value_in: ['gedraineerd', 'verhard']}}
                    ]},

                    {name: 'ts_referenceoverflow', title: 'Referentie overstortreeks', editable: true, visible: true, width: 100, type: 'timeserie', ts_parameter: 'ALMR110', editIf: {prop: 'bucket_type', value_in: ['stedelijk']}},
                    //kwel
                    {title: 'Kwel/ wegzijging', columns: [
                        {name: 'kwelwegz_is_ts', title: 'Is tijdserie?', editable: true, visible: true, width: 65, type: 'boolean'},
                        {name: 'kwelwegz', title: 'Waarde', editable: true, visible: true, width: 65, type: 'number', editIf: {prop: 'kwelwegz_is_ts', value_in: [true]}},
                        {name: 'ts_kwelwegz', title: 'Tijdserie', editable: true, visible: true, width: 170, type: 'timeserie', editIf: {prop: 'kwelwegz_is_ts', value_in: [false]}}
                    ]},
                //als niet berekend
                    {title: 'Opgedrukt', columns: [
                        {name: 'ts_drainageindraft', title: 'Tijdserie drainage en intrek', editable: true, visible: true, width: 170, type: 'timeserie', editIf: {prop: 'is_computed', value_in: [true]}},
                        {name: 'ts_flowoff', title: 'Tijdserie oppervlakte afstroom', editable: true, visible: true, width: 170, type: 'timeserie', editIf: {prop: 'is_computed', value_in: [true]}}
                     ]},
                //concentraties
                    //chlroide
                    {title: 'Chloride', columns: [
                        {name: 'concentr_chloride_drainage_indraft', title: 'Cl drainage', editable: true, visible: true, width: 100, type: 'number'},
                        {name: 'concentr_chloride_flow_off', title: 'Cl afstroom', editable: true, visible: true, width: 100, type: 'number'}
                    ]},
                    //fosfaat
                    {title: 'Fosfaat', columns: [
                        {name: 'replace_impact_by_nutricalc', title: 'Gebruik nutricalc resultaten', editable: true, visible: true, width: 100, type: 'boolean'},
                        {name: 'min_concentr_phosphate_drainage_indraft', title: 'Min P drainage', editable: true, visible: true, width: 100, type: 'number'},
                        {name: 'min_concentr_phosphate_flow_off', title: 'Min P afstroom', editable: true, visible: true, width: 100, type: 'number'},
                        {name: 'incr_concentr_phosphate_drainage_indraft', title: 'Incr P drainage', editable: true, visible: true, width: 100, type: 'number'},
                        {name: 'incr_concentr_phosphate_flow_off', title: 'Incr P afstroom', editable: true, visible: true, width: 100, type: 'number'},
                    ]},
                    //nitraat
                    {title: 'Nitraat', columns: [
                        {name: 'min_concentr_nitrogen_drainage_indraft', title: 'Min N drainage', editable: true, visible: true, width: 100, type: 'number'},
                        {name: 'min_concentr_nitrogen_flow_off', title: 'Min N afstroom', editable: true, visible: true, width: 100, type: 'number'},
                        {name: 'incr_concentr_nitrogen_drainage_indraft', title: 'Incr N drainage', editable: true, visible: true, width: 100, type: 'number'},
                        {name: 'incr_concentr_nitrogen_flow_off', title: 'Incr N afstroom', editable: true, visible: true, width: 100, type: 'number'},
                    ]},

                    {name: 'label_drainaige_indraft', title: 'label_drainaige_indraft', editable: true, visible: false, width: 100, type: 'number'},
                    {name: 'label_flow_off', title: 'label_flow_off', editable: true, visible: false, width: 100, type: 'number'}



                 ]

            },{
                title: 'Kunstwerken',
                anchor:'100%',
                autoHeight: true,
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
                    //is_computed altijd 1 in en 1 uit en verder niet
                    {name: 'id', title: 'id', editable: false, visible: false, width: 100, type: 'text'},
                    {name: 'code', title: 'code', editable: false, visible: false, width: 100, type: 'text'},//automatisch aanmaken
                    {name: 'area', title: 'area', editable: false, visible: false, width: 100, type: 'text'},
                    {name: 'name', title: 'Naam', editable: true, visible: true, width: 170, type: 'text'},
                    {name: 'is_computed', title: 'Berekend', editable: true, visible: false, width: 75, type: 'boolean'},
                    {name: 'in_out', title: 'In of Uit', editable: true, visible: true, width: 75, type: 'combo', choices: ['in', 'uit']},
                    //debiet
                    {name: 'deb_is_ts', title: 'Debiet is tijdserie?', editable: true, visible: true, width: 100, type: 'boolean'},
                    {name: 'deb_wint', title: 'Debiet winter', editable: true, visible: true, width: 75, type: 'number', editIf: {prop: 'deb_is_ts', value_in: [false]}},
                    {name: 'deb_zomer', title: 'Debiet zomer', editable: true, visible: true, width: 75, type: 'number', editIf: {prop: 'deb_is_ts', value_in: [false]}},
                    {name: 'ts_debiet', title: 'Tijdserie debiet', editable: true, visible: true, width: 170, type: 'timeserie', editIf: {prop: 'deb_is_ts', value_in: [true]}},
                    //concentraties
                    {name: 'concentr_chloride', title: 'Cl', editable: true, visible: true, width: 75, type: 'number'},
                    {name: 'min_concentr_phosphate', title: 'Min P', editable: true, visible: true, width: 75, type: 'number'},
                    {name: 'incr_concentr_phosphate', title: 'Incr P', editable: true, visible: true, width: 75, type: 'number'},
                    {name: 'min_concentr_nitrogen', title: 'Min N', editable: true, visible: true, width: 75, type: 'number'},
                    {name: 'incr_concentr_nitrogen', title: 'Incr N', editable: true, visible: true, width: 75, type: 'number'}

               ]
            }]
		}]
	}]
}
