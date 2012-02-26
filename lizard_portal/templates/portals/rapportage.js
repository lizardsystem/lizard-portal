{
    itemId: 'rapportage',
    title: 'Rapportage',
	xtype: 'portalpanel',
	items:[{
		flex: 1,
		items: [{
			title: 'Rapport',
            flex:1,
            plugins: [
                'applycontext'
            ],
            applyParams: function(params) {
                var me = this;
                me.setLoading(true);
                var cm = Lizard.CM;
                var request_params = {}

                Ext.Object.each(cm.objects, function(key, value) {
                    if (value.object && value.object.id) {
                        request_params['key'] = value.object.id
                    }
                })

                me.loader.load({url:'/reporting/',
                    params: request_params,
                    method: 'GET',
                    callback: function() {
                        me.setLoading(false);
                    }
                })
            },
            loader:{
                renderer: 'html',
                url: '/reporting/'
            }
		}]
	}]
}
