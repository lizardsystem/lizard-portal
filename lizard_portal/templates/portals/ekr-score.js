{
    itemId: 'ekr-score',
    title: 'EKR-score',
	xtype: 'portalpanel',
    breadcrumbs: [
    {
        name: 'KRW-overzicht',
        link: 'krw-overzicht'
    },{
        name: 'EKR-score'
    }],
	items:[{
		flex: 1,
		items: [{
            title: Lizard.CM.context.object.name,
            flex: 1,
            xtype: 'multigraphstore',
            plugins: [
                'applycontext'
            ],
            store: Ext.create('Lizard.store.Graph',{
                //context_ready: true,
                data: [{
                    id:1,
                    name: 'EKR scores',
                    visible: 'true',
                    base_url: '/measure/bar/?legend_location=0',
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
			title: 'EKR scores voor ' + Lizard.CM.context.object.name,
            flex:2,
            autoScroll: true,
            plugins: [
                'applycontext'
            ],
            applyParams: function(params) {
                var me = this;
                me.setLoading(true);
                //var url = '/measure/summary/'+ Lizard.CM.context.object.id +'/krw_measures/';
                var url = '/measure/summary/' + Lizard.CM.context.object.id + '/ekr_scores/';
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
            }
            //html: 'Wordt ingevuld zodra de gegevens beschikbaar zijn'
		}]
	}]
}
