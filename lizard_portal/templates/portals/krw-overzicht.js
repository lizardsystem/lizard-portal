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
			html: 'Hier komt het overzicht'
		},{
			title: 'Instellingen',
            height: 150,
            bbar: [{
                    xtype: 'button',
                    text: 'configuratie',
                    iconCls: 'setting',
                    handler: function(menuItem, checked) {
                        Ext.getCmp('portalWindow').linkTo({portalTemplate:'waterbalans-configuratie'});
                    }
                }]
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
