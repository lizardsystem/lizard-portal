//TODO: prevent initial load (saves one request)

Ext.define('Vss.grid.WbHistory', {

    extend: 'Ext.panel.Panel',
    alias: 'widget.wb_grid_history',
    autoScroll:true,
    width: '100%',
    config: {
        log_entry_id: 3395

    },
    log_entry_id: 3395,
    layout:{
        type: 'anchor',
        columns:2
    },
    defaults: {
        margin: 15
    },

    initComponent: function() {
        var me = this;



        Ext.apply(this, {

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
                        width: 350,
                        useSaveBar: false,
                        xtype: 'leditpropgrid',
                        autoHeight: true,
                        editable: false,
                        proxyUrl: '/history/wbconfiguration/area_configuration/' + me.log_entry_id +'/?grid_name=area',
                        proxyParams: {
                            _accept: 'application/json',
                            grid_name: 'area'
                        },
                        plugins: [
                            'applycontext'
                        ],
                        applyParams: function(params) {
                            this.store.applyParams({object_id: params.object.id, grid_name: 'area'});
                            this.store.load();
                        },
                        store: Ext.create('Vss.store.WaterbalanceAreaConfig',{
                            extraParams: {
                                _accept: 'application/json',
                                grid_name: 'area'
                            }
                        })
                    },{
                        title: 'Openwater',
                        width: 350,
                        useSaveBar: false,
                        editable: false,
                        autoHeight: true,
                        xtype: 'leditpropgrid',
                        plugins: [
                            'applycontext'
                        ],
                        proxyUrl: '/history/wbconfiguration/area_configuration/' + me.log_entry_id +'/?grid_name=water',
                        applyParams: function(params) {
                            this.store.applyParams({object_id: params.object.id, grid_name: 'water'});
                            this.store.load();
                        },
                        store: Ext.create('Vss.store.WaterbalanceWaterConfig')
                    }]

                },{

                    title: 'Bakjes',
                    anchor:'100%',
                    autoHeight: true,
                    editable: false,
                    xtype: 'leditgrid',
                    useSaveBar: false,
                    useAddDeleteButtons: false,
                    usePagination: false,
                    applyParams: function(params) {
                        var params = params|| {};

                        if (this.store) {
                            this.store.applyParams({object_id: params.object.id,
                                                       area_object_type: 'Bucket'});
                            this.store.load();
                        }
                    },
                    proxyParams: {
                        area_object_type: 'Bucket'
                    },
                    proxyUrl: '/history/wbconfiguration/area_object_configuration/' + me.log_entry_id +'/',
                    dataConfig:[
                        {name: 'id', title: 'id', editable: false, visible: false, width: 100, type: 'text'},//automatisch
                        {name: 'code', title: 'code', editable: false, visible: false, width: 100, type: 'text'},//automatisch genereren
                        {name: 'area', title: 'Gebied', editable: false, visible: false, width: 100, type: 'text'},//default invullen
                        {name: 'name', title: 'Naam', editable: true, visible: true, width: 100, type: 'text'},
                        {name: 'bucket_type', title: 'Type', editable: true, visible: true, width: 100, type: 'combo', choices: ['verhard', 'gedraineerd', 'ongedraineerd', 'stedelijk']},//todo combobox, met editIf
                        {name: 'is_computed', title: 'Bereken (of opgedrukt)', editable: true, visible: true, width: 100, type: 'boolean'},

                        //computed

                        {name: 'surface', title: 'Oppervlak [m2]', editable: true, visible: true, width: 100, type: 'number'},


                        //instellingen bovenste bakje
                        {title: 'Bovenste bakje', columns: [
                            {name: 'crop_evaporation_factor', title: 'Crop evaporatie factor', editable: true, visible: true, width: 100, type: 'float', editIf: {prop: 'bucket_type', value_in: ['gedraineerd', 'verhard', 'ongedraineerd']}},
                            {name: 'min_crop_evaporation_factor', title: 'Min crop evaporatie factor', editable: true, visible: true, width: 100, type: 'float', editIf: {prop: 'bucket_type', value_in: ['gedraineerd', 'verhard', 'ongedraineerd']}},
                            {name: 'porosity', title: 'Porositeit', editable: true, visible: true, width: 100, type: 'float', editIf: {prop: 'bucket_type', value_in: ['gedraineerd', 'verhard', 'ongedraineerd']}},
                            {name: 'drainage_fraction', title: 'Drainage fractie', editable: true, visible: true, width: 100, type: 'float', editIf: {prop: 'bucket_type', value_in: ['gedraineerd', 'verhard', 'ongedraineerd']}},
                            {name: 'indraft_fraction', title: 'Intrek fractie', editable: true, visible: true, width: 100, type: 'float', editIf: {prop: 'bucket_type', value_in: ['gedraineerd', 'verhard', 'ongedraineerd']}},
                            {name: 'init_water_level', title: 'Initiële waterniveau', editable: true, visible: false, width: 100, type: 'float', editIf: {prop: 'bucket_type', value_in: ['gedraineerd', 'verhard', 'ongedraineerd']}},
                            {name: 'man_water_level', title: 'Max waterniveau', editable: true, visible: true, width: 100, type: 'float', editIf: {prop: 'bucket_type', value_in: ['gedraineerd', 'verhard', 'ongedraineerd']}},
                            {name: 'min_water_level', title: 'Min waterniveau', editable: true, visible: true, width: 100, type: 'float', editIf: {prop: 'bucket_type', value_in: ['gedraineerd', 'verhard', 'ongedraineerd']}}
                        ]},

                        //instellingen onderste bakje
                        {title: 'Onderste bakje', columns: [
                            {name: 'bottom_crop_evaporation_factor', title: 'Crop evaporatie factor', editable: true, visible: true, width: 100, type: 'float', editIf: {prop: 'bucket_type', value_in: ['gedraineerd', 'verhard']}},
                            {name: 'bottom_min_crop_evaporation_factor', title: 'Min crop evaporatie factor', editable: true, visible: true, width: 100, type: 'float', editIf: {prop: 'bucket_type', value_in: ['gedraineerd', 'verhard']}},
                            {name: 'bottom_porosity', title: 'Porositeit', editable: true, visible: true, width: 100, type: 'float', editIf: {prop: 'bucket_type', value_in: ['gedraineerd', 'verhard']}},
                            {name: 'bottom_drainage_fraction', title: 'Drainage fractie', editable: true, visible: true, width: 100, type: 'float', editIf: {prop: 'bucket_type', value_in: ['gedraineerd', 'verhard']}},
                            {name: 'bottom_indraft_fraction', title: 'Intrek fractie', editable: true, visible: true, width: 100, type: 'float', editIf: {prop: 'bucket_type', value_in: ['gedraineerd', 'verhard']}},
                            {name: 'bottom_init_water_level', title: 'Initiële waterniveau', editable: true, visible: false, width: 100, type: 'float', editIf: {prop: 'bucket_type', value_in: ['gedraineerd', 'verhard']}},//mag weg?
                            {name: 'bottom_max_water_level', title: 'Max waterniveau', editable: true, visible: true, width: 100, type: 'float', editIf: {prop: 'bucket_type', value_in: ['gedraineerd', 'verhard']}},
                            {name: 'bottom_min_water_level', title: 'Min waterniveau', editable: true, visible: true, width: 100, type: 'float', editIf: {prop: 'bucket_type', value_in: ['gedraineerd', 'verhard']}}
                        ]},
                        {title: 'Referentie overstort', columns: [
                            {name: 'ts_referenceoverflow', title: 'Tijdserie', editable: true, visible: true, width: 100, type: 'text', editIf: {prop: 'bucket_type', value_in: ['stedelijk']}}
                        ]},
                        //kwel
                        {title: 'Kwel/ wegzijging', columns: [
                            {name: 'kwelwegz', title: 'Waarde', editable: true, visible: true, width: 100, type: 'float'},
                            {name: 'kwelwegz_is_ts', title: 'Is tijdserie?', editable: true, visible: true, width: 65, type: 'boolean'},
                            {name: 'ts_kwelwegz', title: 'Tijdserie', editable: true, visible: true, width: 170, type: 'text', editIf: {prop: 'kwelwegz_is_ts', value_in: [false]}}
                        ]},
                        //als niet berekend
                        {title: 'Opgedrukt', columns: [
                            {name: 'ts_drainageindraft', title: 'Tijdserie drainage en intrek', editable: true, visible: true, width: 170, type: 'text', editIf: {prop: 'is_computed', value_in: [true]}},
                            {name: 'ts_flowoff', title: 'Tijdserie oppervlakte afstroom', editable: true, visible: true, width: 170, type: 'text', editIf: {prop: 'is_computed', value_in: [true]}}
                        ]},
                        //concentraties
                        //chlroide
                        {title: 'Chloride', columns: [
                            {name: 'concentr_chloride_drainage_indraft', title: 'Cl drainage', editable: true, visible: true, width: 100, type: 'float'},
                            {name: 'concentr_chloride_flow_off', title: 'Cl afstroom', editable: true, visible: true, width: 100, type: 'float'}
                        ]},
                        //fosfaat
                        {title: 'Fosfaat', columns: [
                            {name: 'replace_impact_by_nutricalc', title: 'Gebruik nutricalc resultaten', editable: true, visible: true, width: 100, type: 'boolean'},
                            {name: 'min_concentr_phosphate_drainage_indraft', title: 'Min P drainage', editable: true, visible: true, width: 100, type: 'float'},
                            {name: 'min_concentr_phosphate_flow_off', title: 'Min P afstroom', editable: true, visible: true, width: 100, type: 'float'},
                            {name: 'incr_concentr_phosphate_drainage_indraft', title: 'Incr P drainage', editable: true, visible: true, width: 100, type: 'float'},
                            {name: 'incr_concentr_phosphate_flow_off', title: 'Incr P afstroom', editable: true, visible: true, width: 100, type: 'float'}
                        ]},
                        //nitraat
                        {title: 'Nitraat', columns: [
                            {name: 'min_concentr_nitrogen_drainage_indraft', title: 'Min N drainage', editable: true, visible: true, width: 100, type: 'float'},
                            {name: 'min_concentr_nitrogen_flow_off', title: 'Min N afstroom', editable: true, visible: true, width: 100, type: 'float'},
                            {name: 'incr_concentr_nitrogen_drainage_indraft', title: 'Incr N drainage', editable: true, visible: true, width: 100, type: 'float'},
                            {name: 'incr_concentr_nitrogen_flow_off', title: 'Incr N afstroom', editable: true, visible: true, width: 100, type: 'float'}
                        ]},
                        //so4
                        {title: 'Sulfaat', columns: [
                            {name: 'min_concentr_so4_drainage_indraft', title: 'Min S drainage', editable: true, visible: true, width: 100, type: 'float'},
                            {name: 'min_concentr_so4_flow_off', title: 'Min S afstroom', editable: true, visible: true, width: 100, type: 'float'},
                            {name: 'incr_concentr_so4_drainage_indraft', title: 'Incr S drainage', editable: true, visible: true, width: 100, type: 'float'},
                            {name: 'incr_concentr_so4_flow_off', title: 'Incr S afstroom', editable: true, visible: true, width: 100, type: 'float'}
                        ]}
                    ]

                },{
                    title: 'Kunstwerken',
                    anchor:'100%',
                    autoHeight: true,
                    editable: false,
                    xtype: 'leditgrid',
                    useSaveBar: false,
                    useAddDeleteButtons: false,
                    usePagination: false,
                    applyParams: function(params) {
                        var params = params|| {};
                        console.log('apply params');
                        console.log(params);

                        if (this.store) {
                            this.store.applyParams({object_id: params.object.id,
                                                       area_object_type: 'Structure'});
                            this.store.load();
                        }
                    },
                    //proxyUrl: '/portal/wbstructures.json',
                    proxyUrl: '/history/wbconfiguration/area_object_configuration/' + me.log_entry_id +'/',
                    proxyParams: {
                        area_object_type: 'Structure'
                    },
                    dataConfig:[
                        //is_computed altijd 1 in en 1 uit en verder niet
                        {name: 'id', title: 'id', editable: false, visible: false, width: 100, type: 'text'},
                        {name: 'code', title: 'code', editable: false, visible: false, width: 100, type: 'text'},//automatisch aanmaken
                        {name: 'area', title: 'area', editable: false, visible: false, width: 100, type: 'text'},
                        {name: 'name', title: 'Naam', editable: true, visible: true, width: 170, type: 'text'},
                        {name: 'is_computed', title: 'Berekend', editable: false, visible: true, width: 75, type: 'boolean'},
                        {name: 'in_out', title: 'In of Uit', editable: false, visible: true, width: 75, type: 'combo', choices: ['in', 'uit']},
                        //debiet
                        {name: 'deb_is_ts', title: 'Debiet is tijdserie?', editable: true, visible: true, width: 100, type: 'boolean'},
                        {name: 'deb_wint', title: 'Debiet winter', editable: true, visible: true, width: 75, type: 'number', editIf: {prop: 'deb_is_ts', value_in: [false]}},
                        {name: 'deb_zomer', title: 'Debiet zomer', editable: true, visible: true, width: 75, type: 'number', editIf: {prop: 'deb_is_ts', value_in: [false]}},
                        {name: 'ts_debiet', title: 'Tijdserie debiet', editable: true, visible: true, width: 170, type: 'text', editIf: {prop: 'deb_is_ts', value_in: [true]}},
                        //concentraties
                        {name: 'concentr_chloride', title: 'Cl', editable: true, visible: true, width: 75, type: 'float'},
                        {name: 'min_concentr_phosphate', title: 'Min P', editable: true, visible: true, width: 75, type: 'float'},
                        {name: 'incr_concentr_phosphate', title: 'Incr P', editable: true, visible: true, width: 75, type: 'float'},
                        {name: 'min_concentr_nitrogen', title: 'Min N', editable: true, visible: true, width: 75, type: 'float'},
                        {name: 'incr_concentr_nitrogen', title: 'Incr N', editable: true, visible: true, width: 75, type: 'float'},
                        {name: 'min_concentr_so4', title: 'Min S', editable: true, visible: true, width: 75, type: 'float'},
                        {name: 'incr_concentr_so4', title: 'Incr S', editable: true, visible: true, width: 75, type: 'float'}

                    ]
                }]

        });
        this.callParent(arguments);

        var stores = this.query("{store}");
        console.log(stores);
        for (nr in stores) {
            console.log(nr);
            grid = stores[nr]
            grid.store.load()

        }

    }



});



