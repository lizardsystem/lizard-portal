{% load get_portal_template %}
{
    itemId: 'toestand-aan-afvoergebied',
    title: 'Toestand',
    breadcrumbs: [
        {
            name: 'watersysteemkaart',
            link: 'watersysteemkaart'
        },
        {
            name: 'Toestand'
        }
    ],
	xtype: 'portalpanel',
	items: [{
    	width: 200,
		items: [
            {% get_portal_template gebiedseigenschappen %},
            {% get_portal_template communique %},
        {
            title: 'ESF-scores',
            html: 'esf scores (GS300)',
            flex:1
        }]
    },{
		flex: 1,
		items: [{
            title: 'Grafieken',
            flex: 1,
            xtype: 'multigraphstore',
            store: Ext.create('Lizard.store.Graph', {data: {% get_portal_template graphs-aanafvoer_toestand %} })
		}]
    },
    {
		width: 200,
		items: [{
            title: 'Links van dit gebied',
            layout: {
                type: 'table',
                columns:1
            },
            height: 250,
            defaults:{
                width:150,
                xtype:'button',
                margin: 2
            },
            items:[{
                    text: 'Ecologische sleutelfactoren',
                    handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'esf-overzicht'}); }
                }, {
                   text: 'Maatregelen',
                   handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'maatregelen'}); }
                }, {
                   text: 'Watersysteemkaart',
                   handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'homepage'}); }
                }
            ]
 		},{
			title: 'Gerelateerde deelgebieden',
            flex:1,
            autoScroll:true,
            layout: {
                type: 'table',
                columns:1
            },
            defaults:{
                width:150,
                xtype:'button'
            },
            items:[
            ]
		}]
    }]
}

