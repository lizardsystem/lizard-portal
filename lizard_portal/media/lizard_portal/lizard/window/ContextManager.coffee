Ext.define 'Lizard.window.ContextManager',
    #extend:'Ext.data.Store'

    config:
        objects: 
            krw_waterlichaam:
                object_id: null
                object_name: ''
                object_type: 'krw_waterlichaam'
            aan_afvoergebied
                object_id: null
                object_name: ''
                object_type: 'aan_afvoergebied'
            analyse_interpretatie
                object_id: null
                object_name: ''
                object_type: 'analyse_interpretatie'
        last_selected_object:
            object_type: null
            object_id: null
            object_name: null

        headertabs:
            beleid:
                tab: {}
                portalTemplate: null
            watersysteem:
                tab: {}
                portalTemplate: null
            analyse:
                tab: {}
                portalTemplate: null
            rapportage:
                tab: {}
                portalTemplate: null
            beheer:
                tab: {}
                portalTemplate: null

        active_headertab: {}

        user:
            id: ''
            name: ''
            permission_description: 'viewer'
            permissions: []
        period_time:
            period_start: '2000-01-01T00:00'
            period_end: '2002-01-01T00:00'
            moment: '2001-01-01T00:00'

        base_url: 'portal/site/vss/'


    setHeadertab: (tab) ->
        if tyoeof(tab) == 'string'
            @active_headertab = @tabs[tab]
        else
            @active_headertab = @tabs[tab.id]

        #todo: Events

    setContext:(params, headertab=@active_headertab, save_state=true) ->

        if not typeof(params.protalTemplate) == 'undefined'
            if not headertab.portalTemplate == params.protalTemplate
                headertab.portalTemplate = params.protalTemplate
                template_change = true

        if not typeof(params.object_type) == 'undefined'
            if not @last_selected_object.object_type == params.object_type
                if not typeof(@objects[params.object_type]) == 'undefined'
                    #create object
                    @objects[params.object_type] = {object_type: params.object_type}
                @last_selected_object = @objects[params.object_type]
                object_type_change = true
                object = @last_selected_object
        else:
             object = @last_selected_object


        if not typeof(params.object_id) == 'undefined'
            if not object.object_id == params.object_id
                object.object_id = params.object_id
                object_change = true

        if not typeof(params.object_name) == 'undefined'
            if not object.object_name == params.object_name
                object.object_name = params.object_name

        #todo: user and period

        #todo: Events

        if save_state
            try
                window.history.pushState(@getContext(), "#{options}", "#{@base_url}##{@active_headertab.id}/#{@active_headertab.portalTemplate}/#{@last_selected_object.object_type}/#{@last_selected_object.object_id}")
            catch error
                console.log "not able to set pushState"


    getContext: (headertab=@active_headertab) ->
        output = {}

        output.active_headertab = headertab

        output.period = @period

        output.object_type = @last_selected_object.object_type
        output.object_id = @last_selected_object.object_id
        output.object_name = @last_selected_object.object_name

        output.portalTemplate = headertab.portalTemplate

        #todo: user and period





    constructor: (config) ->
        @initConfig(arguments)
        @callParent(arguments)

    initComponent: () ->
        me = @

        Ext.apply @,
            id: 'context_manager'

        @callParent(arguments)


