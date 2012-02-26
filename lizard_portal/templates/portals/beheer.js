
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
                     text: 'EKR - doelen overzicht',
                     {% if user.is_authenticated %}
                     disabled: false,
                     {% endif %}
                     handler: function() { Lizard.CM.setContext({portal_template:'doelen-beheer'}); }
                },
                {
                     text: 'Maatregelen beheer',
                     {% if user.is_authenticated %}
                     disabled: false,
                     {% endif %}
                     handler: function() { Lizard.CM.setContext({portal_template:'maatregelen-beheer'}); }
                },
                {
                     text: 'Organisatie beheer',
                     {% if user.is_authenticated %}
                     disabled: false,
                     {% endif %}
                     handler: function() { Lizard.CM.setContext({portal_template:'organisatie-beheer'}); }
                },
                {
                     text: 'Stuurparameter beheer',
                     {% if user.is_authenticated %}
                     disabled: false,
                     {% endif %}
                     handler: function() { Lizard.CM.setContext({portal_template:'stuurparameter-overzicht'}); }
                },{
                   text: 'Koppeling KRW en aan/afvoer gebieden',
                     {% if user.is_authenticated %}
                     disabled: false,
                     {% endif %}
                     handler: function() { Lizard.CM.setContext({portal_template:'area_link'}); }
                },
                {
                   text: 'Geschikte maatregelen beheer',
                     {% if user.is_authenticated %}
                     disabled: false,
                     {% endif %}
                     handler: function() { Lizard.CM.setContext({portal_template:'area_link'}); }
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
