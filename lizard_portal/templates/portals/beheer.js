{
    itemId: 'beheer',
    title: 'Beheer',
	xtype: 'portalpanel',
	items:[{
		flex: 1,
		items: [{
			title: 'Beheer',
            flex:1,
            layout: {
                type: 'table',
                columns: 1
            },
            defaults:{
                 width:180,
                 xtype:'button',
                 margin: 3
            },
            items: [
                {
                     text: 'Maatregelen beheer',
                     {% if not perms.auth.is_beleidsmaker %}
                     disabled: true,
                     {% endif %}
                     handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'maatregelen-beheer'}); }
                },
                {
                     text: 'Organisatie beheer',
                     {% if not perms.auth.is_beleidsmaker %}
                     disabled: true,
                     {% endif %}
                     handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'organisatie-beheer'}); }
                },
                {
                     text: 'Doelen',
                     {% if not perms.auth.is_beleidsmaker %}
                     disabled: true,
                     {% endif %}
                     handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'doelen-beheer'}); }
                },
                {
                     text: 'Stuurparameters',
                     {% if not perms.auth.is_analyst %}
                     disabled: true,
                     {% endif %}
                     handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'stuurparameter-overzicht'}); }
                },{
                     text: 'Koppeling KRW en aan/afvoer gebieden',
                     {% if not perms.auth.is_analyst %}
                     disabled: true,
                     {% endif %}
                     handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'area_link'}); }
                },
                {
                     text: 'Gebruikersbeheer',
                     {% if not perms.auth.is_helpdesk %}
                     disabled: true,
                     {% endif %}
                     handler: function() { window.open('/manager/') }
                }
            ]
		}]
	}]
}
