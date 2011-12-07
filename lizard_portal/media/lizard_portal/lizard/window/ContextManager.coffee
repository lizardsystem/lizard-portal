Ext.define 'Lizard.window.ContextManager',
    #extend:'Ext.data.Store'

    config:
        objects: 
            krw_waterlichaam:
                object_id: null
                object_name: ''
                object_type: 'krw_waterlichaam'
            aan_afvoergebied:
                object_id: null
                object_name: ''
                object_type: 'aan_afvoergebied'
            analyse_interpretatie:
                object_id: null
                object_name: ''
                object_type: 'analyse_interpretatie'
        last_selected_object:
            object_type: null
            object_id: null
            object_name: null

        headertabs: []

        active_headertab: null

        user:
            id: ''
            name: ''
            permission_description: 'viewer'
            permissions: []

        period_start: Ext.Date.add(new Date(), Ext.Date.YEAR, -5)
        period_end: new Date()
        period:
            selection: 5

        base_url: 'portal/site/vss/'


    setActiveHeadertab: (tab) ->
        if typeof(tab) == 'string'
            tab = Ext.Array.filter(@headertabs, (element) ->
                if element.name == tab
                    return element
            )
            if tab.length > 0
                tab = tab[0]

        if tab
            @active_headertab = tab
            context = @getContext()
            pw = Ext.getCmp('portalWindow')
            if pw
                if context.object_id
                    #show selected or default template
                    pw.linkTo({})
                else
                    pw.showNavigationPortalTemplate()
                
        else
            console.log('headertab not found')
        return tab

        #todo: Events

    setContext:(params, save_state=true, headertab=@active_headertab) ->
        console.log('new context params are:')
        console.log(params)

        if typeof(params.headerTab) != 'undefined'
            if headertab.name != params.headerTab
                tab = Ext.getCmp('headertab_' + params.headerTab)
                if !tab.pressed
                    tab.toggle()
                else
                    @setActiveHeadertab(params.headerTab)
                headertab_change = true
                console.log('new headertab')
                headertab=@active_headertab

        if typeof(params.portalTemplate) != 'undefined'
            if headertab.portalTemplate != params.portalTemplate
                headertab.portalTemplate = params.portalTemplate
                template_change = true
                console.log('new portal template')

        if typeof(params.object_type) != 'undefined'
            if @last_selected_object.object_type != params.object_type
                if typeof(@objects[params.object_type]) == 'undefined'
                    #create object
                    @objects[params.object_type] = {object_type: params.object_type}
                @last_selected_object = @objects[params.object_type]
                object_type_change = true
                object = @last_selected_object
                console.log('new object type')
        else:
             object = @last_selected_object


        if typeof(params.object_id) != 'undefined'
            if object.object_id != params.object_id
                console.log('new object id')
                object.object_id = params.object_id
                object_change = true

        if typeof(params.object_name) != 'undefined'
            if object.object_name != params.object_name
                console.log('new object name')
                object.object_name = params.object_name


        if typeof(params.period) != 'undefined'
            @period = params.period


        #todo: user and period

        #todo: Events

        if save_state
            #try
            context = @getContext(null, true)


            window.history.pushState(context, "#{params}", "#{@base_url}##{context.active_headertab.name}/#{context.portalTemplate}/#{context.object_type}/#{context.object_id}")
            #catch error
            #   console.log "not able to set pushState"


    getContext: (headertab=@active_headertab, no_references=false) ->
        me = @

        if headertab == null
            headertab = {}
        output = {}


        if no_references
            output.active_headertab = {
                name: headertab.name
                active_portal_template: headertab.active_portal_template
            }
        else
            output.active_headertab = headertab

        #output.period = @period_time


        #check relevant objecttype
        check = (el) ->
            if el == me.last_selected_object.object_type
                return true


        #object = @last_selected_object

        #todo:  dit deel werkt nog niet lekker
        if headertab
            console.log('supported objecttypes are:')
            console.log(headertab.object_types)
            if Ext.Array.some(headertab.object_types, check)
                object = @last_selected_object
                console.log('last selected object supported in context')
            else
                object = {}
                console.log('find last selected objects of supported types. Object cache is:')
                console.log(me.objects)
                for obj_type in headertab.object_types
                   console.log(obj_type)
                   if me.objects[obj_type]
                      if me.objects[obj_type].object_id
                          console.log('found:')

                          object = me.objects[obj_type]
                          console.log(object)
                          #@last_selected_object = object
                          break

                #todo: kijken naar een relevante object voor huidige header

        output.object_type = object.object_type
        output.object_id = object.object_id
        output.object_name = object.object_name

        output.portalTemplate = headertab.portalTemplate || headertab.default_portal_template

        output.period = @getPeriod()
        output.period_start =  @getPeriod_start()
        output.period_end =  @getPeriod_end()

        return output

        #todo: user and period





    constructor: (config) ->
        @initConfig(config)
        @callParent(arguments)

    initComponent: () ->
        me = @

        Ext.apply @,
            id: 'context_manager'

        @callParent(arguments)


