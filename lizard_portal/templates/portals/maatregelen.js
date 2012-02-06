{
    itemId: 'maatregelen',
    title: 'Maatregelen',
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
			title: 'Maatregelen',
            flex:1,
            autoScroll: true,
            plugins: [
                'applycontext'
            ],
            applyParams: function(params) {
                var me = this;
                me.setLoading(true);
                var cm = Ext.getCmp('portalWindow').context_manager.getContext();
                var url = '/measure/summary/'+ cm.object_id +'/krw_measures/';
                me.loader.load({
                    url:url,
                    method: 'GET'
                });
                me.setLoading(false);
            },
            loader:{
                renderer: 'html'
            }
		}]
	}]
}
