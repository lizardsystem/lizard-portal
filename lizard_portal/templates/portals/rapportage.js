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
                var cm = Ext.getCmp('portalWindow').header.context_manager
                alert(cm.objects.krw_waterlichaam.object_id)
                alert(cm.objects.aan_afvoergebied.object_id)
                me.loader.load({url:'/reporting/',
                    params:{
                        krw_waterlichaam: cm.objects.krw_waterlichaam.object_id,
                        aan_afvoergebied: cm.objects.aan_afvoergebied.object_id
                    },
                    method: 'GET'
                })
                me.setLoading(false);
            },
            loader:{
                renderer: 'html',
                url: '/reporting/'

            }
		}]
	}]
}
