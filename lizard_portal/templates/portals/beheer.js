{
    itemId: 'beheer',
    title: 'Beheer',
	xtype: 'portalpanel',
	items:[{
		flex: 1,
		items: [{
			title: 'Beheer',
            flex:1,
            layout: 'table',
            defaults:{
                 width:180,
                 xtype:'button',
                 margin: 3
            },
            items: [
                {
                     text: 'Maatregelen beheer',
                     handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'maatregelen-beheer'}); }
                },
                {
                     text: 'Organisatie beheer',
                     handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'organisatie-beheer'}); }
                },
                {
                     text: 'Doelen',
                     handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'doelen-beheer'}); }
                },
                {
                     text: 'Gebruikersbeheer',
                     handler: function() { window.open('/manager/') }
                }
            ]
		}]
	}]
}
