{
    itemId: 'maatregelen',
    title: 'Maatregelen',
	xtype: 'portalpanel',
    breadcrumbs: [
    {
        name: 'Watersysteemkaart',
        link: 'homepage'
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
                    panel = panelHeader.up('panel');

                    Ext.create('Ext.window.Window', {
                        title: 'Nieuwe maatregel toevoegen',
                        width: 800,
                        height: 600,
                        modal: true,

                        finish_edit_function: function (updated_record) {
                            panel.applyParams()
                        },
                        editpopup: true,
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
            } ]


		}]
	}]
}
