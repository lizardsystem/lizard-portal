/**
 * Created by PyCharm.
 * User: bastiaanroos
 * Date: 19-10-11
 * Time: 17:52
 * To change this template use File | Settings | File Templates.
 */
{% load get_portal_template %}
{
    itemId: 'waterbalans',
    title: 'Waterbalans',
	xtype: 'portalpanel',
    breadcrumbs: [{
            name: 'watersysteemkaart',
            link: 'homepage'
        },
        {
            name: 'waterbalans'
        }
    ],
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
                text: 'Overzicht instellingen',
                iconCls: 'l-icon-setting',
                handler: function(menuItem, checked) {
                    Ext.getCmp('portalWindow').linkTo({portalTemplate:'waterbalans-instellingen-overzicht'});
                }
            } {% if perms.auth.is_analyst %},{
                xtype: 'button',
                text: 'Configureren',
                iconCls: 'l-icon-setting',
                handler: function(menuItem, checked) {
                    Ext.getCmp('portalWindow').linkTo({portalTemplate:'waterbalans-configuratie'});
                }
            }{% endif%}]
		}]
	},{
		flex: 1,
		items: [{
			title: 'Grafieken',
            flex: 1,
            xtype: 'multigraph',
            graph_service_url: '/graph/',
            context_manager: Ext.getCmp('portalWindow').context_manager,
            graphs: {% get_portal_template graphs-waterbalans %}

		}]
	}]
}
