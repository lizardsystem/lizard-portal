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
            } {% if perms.is_analyst %},{
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
            graphs: [{
                title: 'Waterbalans met sluitfout',
                params: {
                    item:[{
                        parameter: "N.belasting.kritisch",
                        //module: "ImportLE",
                        location: "SAP",
                        type: 'line',
                        layout: {color: 'red'}
                    },{
                        parameter: "P.belasting.kritisch",
                        //module: "ImportLE",
                        location: "SAP",
                        type: 'line',
                        layout: {color: 'blue'}
                    }]
                }
            },{
                title: 'Fracties en choride concentratie',
                params: {
                    item:[{
                        parameter: "N.belasting.kritisch",
                        //module: "ImportLE",
                        location: "SAP",
                        type: 'line',
                        layout: {color: 'red'}
                    },{
                        parameter: "P.belasting.kritisch",
                        //module: "ImportLE",
                        location: "SAP",
                        type: 'line',
                        layout: {color: 'blue'}
                    }]
                }
            },{
                title: 'Waterstand met sluitfout',
                timeseries:[{
                    parameter_id: "ALMR110",
                    module_id: "ImportLE",
                    ident: "53R0017"
                }]
            }, {
                title: 'Cumulatieve debieten',
                params: {
                    item:[{
                        parameter: "N.belasting.kritisch",
                        //module: "ImportLE",
                        location: "SAP",
                        type: 'line',
                        layout: {color: 'red'}
                    },{
                        parameter: "P.belasting.kritisch",
                        //module: "ImportLE",
                        location: "SAP",
                        type: 'line',
                        layout: {color: 'blue'}
                    }]
                }
            }, {
                title: 'Fosfaatbelasting',
                params: {
                    item:[{
                        parameter: "N.belasting.kritisch",
                        //module: "ImportLE",
                        location: "SAP",
                        type: 'line',
                        layout: {color: 'red'}
                    },{
                        parameter: "P.belasting.kritisch",
                        //module: "ImportLE",
                        location: "SAP",
                        type: 'line',
                        layout: {color: 'blue'}
                    }]
                }
            }]
		}]
	}]
}
