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
            {% get_portal_template gebiedseigenschappen %},
            {% get_portal_template communique %},
        {
			title: 'Gebieden links',
            flex:1,
            html: 'Aan-afvoergebieden:<br> <a href="javascript:Ext.getCmp(\'portalWindow\').linkTo({portalTemplate:\'toestand-aan-afvoergebied\', object_id:\'3300\'})">Muyeveld<a/> '
		}]
	},{
		flex: 1,
		items: [{
            title: 'Grafieken',
            flex: 1,
            xtype: 'multigraphstore',
            store: Ext.create('Lizard.store.Graph', {data: {% get_portal_template graphs-krw-overzicht %} }),
            tools: [{
                type: 'save',
                handler: function (e, target, panelHeader, tool) {
                    var cm = Ext.getCmp('portalWindow').context_manager.getContext();

                    Ext.create('Ext.window.Window', {
                        title: 'Stuurparameters instellen',
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
                            url: '/measure/steering_parameter_form/',
                            params: {
                                object_id: cm.object_id
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
