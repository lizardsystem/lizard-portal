/**
 * Created by PyCharm.
 * User: bastiaanroos
 * Date: 19-10-11
 * Time: 17:52
 * To change this template use File | Settings | File Templates.
 */
{% load get_portal_template %}
{
    itemId: 'krw-overzicht',
    title: 'KRW overzicht',
	xtype: 'portalpanel',
    breadcrumbs: [
    {
        name: 'KRW-overzicht'
    }],
	items:[{
		width: 300,
		items: [
            {% get_portal_template krw_waterlichaam_eigenschappen %},
            {% get_portal_template communique %},
            {% get_portal_template gebieden_links %}
        ]
	},{
		flex: 1,
		items: [{
            title: 'Grafieken',
            flex: 1,
            xtype: 'multigraphstore',
            applyParams: function(params) {
                var me = this;
                me.store.load({
                    params: {
                        object_id: params.object.id
                    }
                });
            },
            plugins: [
                'applycontext'
            ],
            store: Ext.create('Lizard.store.Graph',{
                storeId: 'krw_overzicht_store',
                context_ready: true,
                proxy: {
                    type: 'ajax',
                    url: '/measure/api/steer_parameter_graphs/',
                    extraParams: {
                          _accept: 'application/json'
                    },
                    reader: {
                          //root: 'data',
                          type: 'json'
                    }
                }
            }),
            tools: [{
                type: 'edit',
                handler: function (e, target, panelHeader, tool) {
                    var cm = Ext.getCmp('portalWindow').context_manager.getContext();

                    Ext.create('Ext.window.Window', {
                        title: 'Stuurparameters instellen',
                        width: 800,
                        height: 600,
                        modal: true,
                        editpopup: true,
			constrainHeader: true,
                        listeners: {
                            close: function() {
                                var store = Ext.StoreManager.lookup('krw_overzicht_store');
                                store.load();
                            }
                        },
                        loader:{
                            loadMask: true,
                            autoLoad: true,
                            url: '/measure/steering_parameter_form/',
                            params: {
                                object_id: cm.object.id
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
