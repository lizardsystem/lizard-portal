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
		// keep these objects in sync with those in ../application/vss.js
                {
                     text: 'ESF overzicht',
                     {% if user.is_authenticated %}
                     disabled: false,
                     {% endif %}
                     handler: function() { Lizard.CM.setContext({portal_template:'esf-overzicht-tabel'}); }
                },
                {
                     text: 'Stuurparameters',
                     {% if user.is_authenticated %}
                     disabled: false,
                     {% endif %}
                     handler: function() { Lizard.CM.setContext({portal_template:'stuurparameter-overzicht'}); }
                },
                {
                     text: 'EKR overzicht',
                     {% if user.is_authenticated %}
                     disabled: false,
                     {% endif %}
                     handler: function() { Lizard.CM.setContext({portal_template:'doelen-beheer'}); }
                },
                {
                     text: 'Maatregelen',
                     {% if user.is_authenticated %}
                     disabled: false,
                     {% endif %}
                     handler: function() { Lizard.CM.setContext({portal_template:'maatregelen-beheer'}); }
                },
                {
                   text: 'Geschikte maatregelen',
                     {% if user.is_authenticated %}
                     disabled: false,
                     {% endif %}
                     handler: function() { Lizard.CM.setContext({portal_template:'esfpattern-beheer'}); }
                },
                {
                     text: 'Organisaties',
                     {% if user.is_authenticated %}
                     disabled: false,
                     {% endif %}
                     handler: function() { Lizard.CM.setContext({portal_template:'organisatie-beheer'}); }
                },
		        {
                   text: 'Koppeling KRW en aan/afvoergebieden',
                     {% if user.is_authenticated %}
                     disabled: false,
                     {% endif %}
                     handler: function() { Lizard.CM.setContext({portal_template:'area_link'}); }
                },
                    text: 'Upload configuratie file',
                    {% if user.is_authenticated %}
                    disabled: false,
                    {% endif %}
                    handler: function() { window.open('/portal/uploadfile/') }
                },
                {
                   text: 'Valideren waterbalans/ESF configuraties',
                     {% if user.is_authenticated %}
                     disabled: false,
                     {% endif %}
                     handler: function() { Lizard.CM.setContext({portal_template:'valideer_configuraties'}); }
                },
                {
                     text: 'Gebruikers',
                     {% if user.is_authenticated %}
                         disabled: false,
                     {% endif %}
                     handler: function() { window.open('/manager/') }
                },
                {
                     text: 'Serverprocessen',
                     {% if user.is_authenticated %}
                     disabled: false,
                     {% endif %}
                     handler: function() { window.open('/task/') }
                }
            ]
		}]
	}]
}
