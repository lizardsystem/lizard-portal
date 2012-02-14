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
                        title: 'Nieuwe maatregel toevoegen',
                        width: 800,
                        height: 600,
                        modal: true,
                        finish_edit_function: function (updated_record) {
                            //todo
                        },
                        editpopup: true,
                        loader:{
                            loadMask: true,
                            autoLoad: true,
                            url: '/measure/measure_detailedit_portal/',
                            ajaxOptions: {
                                method: 'GET'
                            },
                            renderer: 'component'
                        }
                    }).show();
                }
            } ]


		}]
	}]
}
