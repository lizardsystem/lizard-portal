a = {
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

                disabled: false,


                handler: function() { Lizard.CM.setContext({portal_template:'esf-overzicht-tabel'}); }
            },
            {
                text: 'Stuurparameters',

                disabled: false,

                handler: function() { Lizard.CM.setContext({portal_template:'stuurparameter-overzicht'}); }
            },
            {
                text: 'EKR overzicht',

                disabled: false,

                handler: function() { Lizard.CM.setContext({portal_template:'doelen-beheer'}); }
            },
            {
                text: 'Maatregelen',

                disabled: false,

                handler: function() { Lizard.CM.setContext({portal_template:'maatregelen-beheer'}); }
            },
            {
                text: 'Geschikte maatregelen',

                disabled: false,


                handler: function() { Lizard.CM.setContext({portal_template:'esfpattern-beheer'}); }
            },
            {
                text: 'Organisaties',

                disabled: false,

                handler: function() { Lizard.CM.setContext({portal_template:'organisatie-beheer'}); }
            },
            {
                text: 'Koppeling KRW en aan/afvoergebieden',

                disabled: true,

                handler: function() { Lizard.CM.setContext({portal_template:'area_link'}); }
            },
                text: 'Upload configuratie file',

                disabled: false,

                handler: function() { window.open('/portal/uploadfile/') }
            },
            {
                text: 'Valideren waterbalans/ESF configuraties',

                    disabled: false,


                handler: function() { Lizard.CM.setContext({portal_template:'valideer_configuraties'}); }
            },
            {
                text: 'Gebruikers',

                    disabled: true,

                handler: function() { window.open('/manager/') }
            },
            {
                text: 'Serverprocessen',

                    disabled: false,


                handler: function() { window.open('/task/') }
            }
]
}]
}]
}