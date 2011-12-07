{
    itemId: 'analyse',
    title: 'Analyse scherm',
	xtype: 'portalpanel',
	items:[{
		width: 300,
		items: [{
			title: 'Navigatie',
            flex:1
		}]
	},{
		flex: 1,
		items: [{
			title: 'Kaart',
            rbar:[{
                    text: 'ESF',
                    handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'esf-overzicht'}); }
                }, {
                   text: 'WB',
                   handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'waterbalans'}); }
                }, {
                   text: 'AI',
                   handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'analyse-interpretatie'}); }
                }, {
                   text: 'Advies',
                   handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'advies'}); }
                }, {
                   text: 'Maatr',
                   handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'maatregelen'}); }
                }, {
                   text: 'Tsnd',
                   handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'toestand-aan-afvoergebied'}); }
                }],
            flex:1
		}]
	}]
}
