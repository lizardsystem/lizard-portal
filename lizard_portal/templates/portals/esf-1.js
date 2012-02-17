{% load get_portal_template %}

{
    itemId: 'esf-1',
    title: 'ESF details',
    xtype: 'portalpanel',
    breadcrumbs: [
        {
            name: 'watersysteemkaart',
            link: 'homepage'
        },
        {
            name: 'ESF details'
        }
    ],
	items: [{
		width:500,
		items: [{
            flex:2,
            title: "Opbouw ESF'en",
            closable: false,
            items: {
                flex: 1,
                xtype: 'esf_grid',
            {% if user.is_authenticated %}
                editable:true
            {% else %}
                editable:false
            {% endif %}
            }
        }]
	},{
        flex:1,
        items: {
            title: 'Grafieken',
            flex: 1,
            xtype: 'multigraph',
            graph_service_url: '/graph/',
            context_manager: Ext.getCmp('portalWindow').context_manager,
            graphs: {% get_portal_template graphs-esf %}
        }
	}]
}
