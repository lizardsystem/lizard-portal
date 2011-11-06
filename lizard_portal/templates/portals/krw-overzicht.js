/**
 * Created by PyCharm.
 * User: bastiaanroos
 * Date: 19-10-11
 * Time: 17:52
 * To change this template use File | Settings | File Templates.
 */
{
    itemId: 'krw-overzicht',
    title: 'KRW overzicht',
	xtype: 'portalpanel',
	items:[{
		width: 300,
		items: [{
			title: 'Info',
            flex:1,
			html: '{{ area.name }}'
		}]
	},{
		flex: 1,
		items: [{
			title: 'Grafieken',
            flex:1,
 			html: '<div class="portlet-content">Hier komen de grafieken</div>',
            extent: 2
		}]
	}]
}
