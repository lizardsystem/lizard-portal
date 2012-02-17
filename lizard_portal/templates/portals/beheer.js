
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
                 margin: 3,
                 disabled:true
            },
            items: [
                {
                     text: 'Maatregelen beheer',
                     {% if user.is_authenticated %}
                     disabled: false,
                     {% endif %}
                     handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'maatregelen-beheer'}); }
                },
                {
                     text: 'Organisatie beheer',
                     {% if user.is_authenticated %}
                     disabled: false,
                     {% endif %}
                     handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'organisatie-beheer'}); }
                },
                {
                     text: 'EKR doelen',
                     {% if user.is_authenticated %}
                     disabled: false,
                     {% endif %}
                     handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'doelen-beheer'}); }
                },
                {
                     text: 'Stuurparameters',
                     {% if user.is_authenticated %}
                     disabled: false,
                     {% endif %}
                     handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'stuurparameter-overzicht'}); }
                },{
                     text: 'Koppeling KRW en aan/afvoer gebieden',
                     {% if user.is_authenticated %}
                     disabled: false,
                     {% endif %}
                     handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'area_link'}); }
                },
                {
                     text: 'Gebruikersbeheer',
                     {% if user.is_authenticated %}
                         disabled: false,
                     {% endif %}
 
                     handler: function() { window.open('/manager/') }
                }
            ]
		}]
	}]
}
