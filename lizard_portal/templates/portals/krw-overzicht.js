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
            store: Ext.create('Lizard.store.Graph', {data: {% get_portal_template graphs-krw-overzicht %} })
		}]
	}]
}
