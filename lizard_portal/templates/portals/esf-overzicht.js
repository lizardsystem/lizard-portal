/**
 * Created by PyCharm.
 * User: bastiaanroos
 * Date: 18-10-11
 * Time: 11:17
 * To change this template use File | Settings | File Templates.
 */
{
    xtype: 'portalpanel',
	items: [{
		id: 'col-1',
		width:800,
		items: [{
			id: 'portlet-4',
			title: 'Overzicht Ecologische Sleutel Factoren',
            height:500,
            items: {
			    xtype: 'image',
                src: '/static_media/lizard_portal/ESF.png',
                listeners: {
                    click: {
                        element: 'el', //bind to the underlying el property on the panel
                        fn: function(){
                             console.log('click el');
                             Ext.getCmp('portalWindow').linkTo({portalTemplate:'esf-overzicht'});
                        }
                    }
                }
             }
		}]
	}]
}