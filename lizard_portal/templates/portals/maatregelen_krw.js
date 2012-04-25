{
    itemId: 'maatregelen_krw',
    title: 'Maatregelen KRW-waterlichaam',
	xtype: 'portalpanel',
    breadcrumbs: [
    {
        name: 'KRW-overzicht',
        link: 'krw-overzicht'
    },{
        name: 'Maatregelen'
    }],
	items:[{
		flex: 1,
		items: [{
            title: 'Maatregelengrafiek',
            flex: 1,
            xtype: 'multigraphstore',
            plugins: [
                'applycontext'
            ],
            store: Ext.create('Lizard.store.Graph',{
                //context_ready: true,
                data: [{
                    id:1,
                    name: 'Maatregelen',
                    visible: 'true',
                    base_url: '/measure/measure_graph/' + Lizard.CM.context.object.id + '/focus?legend-location=7&wide_left_ticks=true',
                    use_context_location: false,
                    location: '3201',  // Later: Lizard.CM.context.object.id
                    predefined_graph: 'ekr',
                    width: null,
                    height: null,
                    extra_params: {},
                    has_reset_period: false,
                    reset_period: false,
                    has_cumulative_period: false,
                    cumulative_period: false,
                    extra_ts: null
                }]
            })
        },{
			title: 'Maatregelen',
            flex:2,
            autoScroll: true,
            plugins: [
                'applycontext'
            ],
            applyParams: function(params) {
                var me = this;
                me.setLoading(true);
                var url = '/measure/summary/'+ Lizard.CM.context.object.id +'/krw_measures/';
                me.loader.load({
                    url:url,
                    method: 'GET',
                    success: function() {
                      reloadGraphs();
                      me.setLoading(false);
                    },
                    failure: function() {
                      me.setLoading(false);
                    }
                });
            },
            loader:{
                renderer: 'html'
            },
            tools: [{
                type: 'plus',
                handler: function (e, target, panelHeader, tool) {
                    Ext.create('Ext.window.Window', {
                        measureScreen: true,
                        title: 'Nieuwe maatregel toevoegen',
                        width: 800,
                        height: 600,
                        modal: true,
                        editpopup: true,
                        constrain:true,
                        loader:{
                            loadMask: true,
                            autoLoad: true,
                            url: '/measure/measure_detailedit_portal/',
                            baseParams: {
                                area_id: Lizard.CM.getContext().object.id
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
	}]
}
