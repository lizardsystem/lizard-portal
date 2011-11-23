Ext.define 'Lizard.window.ContextManager',
    #extend:'Ext.data.Store'

    config:
        active_tab: ''
        

        user:
            id: ''
            name: ''
            permission_description: 'viewer'
            permissions: []
        period_time:
            period_start: '2000-01-01T00:00'
            period_end: '2002-01-01T00:00'
        object:
            type: 'aan_afvoergebied'
            id: null
        sub_object:
            type: 'annotatie'
            id: null
        template:
            portalTemplate:'homepage'
            base_url: 'portal/watersysteem'

    getActiveTab: () ->





    constructor: (config) ->
        @initConfig(arguments)
        @callParent(arguments)
    initComponent: () ->
        me = @




        Ext.apply @,
            collapsible: false
            floatable: false


        @callParent(arguments)


