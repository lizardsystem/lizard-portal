Ext.define 'Lizard.ContextManager',
    extend: 'Ext.AbstractManager'
    alternateClassName: 'Lizard.CM',
    mixins: {
        observable: 'Ext.util.Observable'
    },

    singleton: true,

    setContext:(params, save_state=true, headertab=@active_headertab) ->
        @_setContext(params, save_state, headertab)

    setConfiguration:(params) ->
        if params.context
            @context = Ext.Object.merge(@context, params.context)
            delete params.context

        Ext.apply(@,params)

    objects: {}
    headertabs: []
    periods: [
        { boxLabel: 'dg', name: 'period', inputValue: 1, dt: [Ext.Date.DAY,-1]},
        { boxLabel: '2dg', name: 'period', inputValue: 2, dt: [Ext.Date.DAY,-2] },
        { boxLabel: 'wk', name: 'period', inputValue: 3, dt: [Ext.Date.DAY,-7] },
        { boxLabel: 'mnd', name: 'period', inputValue: 4, dt: [Ext.Date.MONTH,-1] },
        { boxLabel: 'jr', name: 'period', inputValue: 5, dt: [Ext.Date.YEAR,-1] },
        { boxLabel: '5jr', name: 'period', inputValue: 6, dt: [Ext.Date.YEAR,-5] },
        { boxLabel: 'anders', name: 'period', inputValue: 0, dt: [null, null] }
    ]
    context:
        period_start: Ext.Date.add(new Date(), Ext.Date.YEAR, -5)
        period_end: new Date()
        period:
            start: Ext.Date.add(new Date(), Ext.Date.YEAR, -5)
            end: new Date()
            type: 6
        user:
            id: ''
            name: ''
            usergroups: ''
        base_url: 'portal/site/vss/'
        background_layer: ''

    #////
    #  _setObjectOfType(object)
    #  set or create object_reference of an object of certain type
    #
    #  input:
    #      - object (dict) with object_id, object_name and object_type
    #      or string of of the type for just creating empty object
    #////
    _setObjectOfType: (object) ->
        if typeof(object) == 'string'
            object = {type: object}

        @objects[object.type] = Ext.Object.merge({
                id: null
                name: ''
                type: ''
            },object)
        return @objects[object.type]

    #////
    #  _checkChangeAndUpdate: (context_object, new_object)
    #  update object based on new object and returns if object is updated
    #  works for objects of different type (objects max 1 deep)
    #
    #  input:
    #      context_param: object of context manager
    #      new_param: new object for updating context_object
    #
    #////

    _checkChangeAndUpdate: (context_param, new_param) ->
        if typeof(new_param) == 'undefined'
            return false

        new_value = {}
        updated = false
        if Ext.type(new_param) == 'object'
            Ext.Object.each( new_param, (key, value) ->
                if not context_param or not key in context_param
                    updated = true
                    new_value[key] = value
                else if value != context_param[key]
                    updated = true
                    new_value[key] = value
                return
            )
        else
            if context_param != new_param
                updated = true
                new_value = new_param

        if updated
            return new_value
        else
            return null

    #////
    #  _setContext(params, save_state, headertab)
    #   update context based on given params, fires change events and save_state
    #
    #  input:
    #      params: dict with parameters of new context
    #      save_state: saves state (in url and for browser history)
    #      headertab: change context with this header in mind (still needed?)
    #
    #   special items:
    #       portal_template
    #       headertab (string with name or headertab object)
    #       object object
    #
    #
    #////
    _setContext:(params, save_state=true, silent=false) ->
        # console.log('new context params are:')
        # console.log(params)

        me = @

        changed_context = {}

        Ext.Object.each(params, (key, value)->

            new_value = me._checkChangeAndUpdate(me.context[key], value)
            if new_value != null
                changed_context[key] = new_value

            return
        )

        if changed_context.headertab
            changed_context.headertab = params.headertab

        if Ext.Object.getKeys(changed_context).length != 0
        #     console.log('context not changed')
        # else
            #context is updated
            # console.log('contextchange')

            if changed_context['headertab'] and typeof(changed_context.headertab) == 'string'
                #get real headertab object based on string

                changed_context.headertab = Ext.Array.filter(@headertabs, (element) ->
                    if element.name == changed_context.headertab
                        return element
                )
                if changed_context.headertab.length > 0
                    changed_context.headertab = changed_context.headertab[0]

            if changed_context['headertab'] and not params['portal_template']
                #add headertab switch, select default template (except when specified in change)
                changed_context['portal_template'] = changed_context.headertab.default_portal_template

            if changed_context['period']
                changed_context['period'] = @calcPeriod(Ext.Object.merge({}, @context['period'], changed_context['period']))

            @context = Ext.Object.merge(me.context, changed_context)

            if changed_context['object']
                if not changed_context.object['type']
                    changed_context.object.type = @context.object.type
                @_setObjectOfType(changed_context.object)

            if  @context.headertab
                # console.log('supported objecttypes are:')
                # console.log(@context.headertab.object_types)
                object = {}
                for obj_type in @context.headertab.object_types
                    if me.objects[obj_type]
                        if me.objects[obj_type].id
                            # console.log('found object of objecttype:')
                            object = Ext.Object.merge({}, @objects[obj_type]) #copy object
                            # console.log('found object of objecttype:')
                            # console.log(changed_context.object)
                            break
                @context.object = object
                changed_context.object = object

            changed_elements = {}
            Ext.Object.each(changed_context, (key, value) ->
                changed_elements[key] = true
                return
            )

            new_context = @getContext()

            if not silent

                @fireEvent('contextchange',
                    changed_elements, #object with updated objects (with value True)
                    changed_context,  #changed objects
                    new_context,      #new full context (old and new context)
                    @                 #context manager
                )

            if save_state
                #try
                headertab_name = new_context.headertab.name
                new_context = Ext.Object.merge({}, new_context, {headertab: headertab_name, active_headertab: headertab_name})
                window.history.pushState(new_context, "#{params}", "#{new_context.base_url}##{headertab_name}/#{new_context.portal_template}")
                #selected object is now available though context save and load, so removed object part. This still can be used by
                # external application to directly link to page of an object  (/#{new_context.object.type}/#{new_context.object.id})
                #catch error
                #   console.log "not able to set pushState"

    #////
    # calcPeriod(period)
    # calculate period based on period-object
    #
    # input:
    # period: object with start(date), end(start) and type (predefined period type, see periods at config)
    #
    # returns period object with start, end and type
    #////
    calcPeriod: (period) ->
        output = {}
        if period.start and typeof(period.start) == 'string'
            period.start = Ext.Date.parse(period.start, 'Y-m-d')
        if period.end and typeof(period.end) == 'string'
            period.end = Ext.Date.parse(period.end, 'Y-m-d')
        if period.type == 0 or not period.start or not period.end
            if period.start and period.end
                output = period
            else if period.start
                output = period
                output.end = new Date()
            else if period.end
                output = period
                output.start = Ext.Date.add(period.end, Ext.Date.YEAR, -1)
            else
                output.end =  new Date()
                output.start = Ext.Date.add(output.end, Ext.Date.YEAR, -1)
                output.type = 0
        else
            selected_type = Ext.Array.filter(@periods, (obj) ->
                if obj.inputValue == period.type
                    return true
                else
                    return false
            )[0]
            output.end = new Date()
            output.start = Ext.Date.add(new Date(), selected_type.dt[0], selected_type.dt[1])
            output.type = period.type

        return output

    getContext: (headertab=null, no_references=false) ->

        if headertab != null
            console.log('is headertab support outside active really needed. not supported anymore')

        if no_references
            console.log('is no_references support outside active really needed. not supported anymore')

        me = @

        output = @context

        #for backward compatibility?
        output.active_headertab = @context.headertab
        return output


    constructor: (config) ->
        @initConfig(config)
        @callParent(arguments)
        @addEvents(['contextchange'])

        me = @
        window.onunload = ()->
            if me.context.user.id
                context =  Ext.JSON.encode({
                    objects: me.objects
                    context:
                        period:
                            start: Ext.Date.format(me.context.period.start, 'Y-m-d')
                            end: Ext.Date.format(me.context.period.end, 'Y-m-d')
                            type: me.context.period.type
                        background_layer: me.context.background_layer
                })

                portalWindow = Ext.getCmp('portalWindow')
                portalWindow.setLoading('Opslaan gebruikersinstellingen')
                Ext.Ajax.request
                    async:false
                    url: '/manager/api/context/?_accept=application/json',
                    params:
                        context: context
                    method: 'POST'
                    success: (xhr) =>
                        Ext.Msg.alert("Melding", "Context opgeslagen")
                        portalWindow.setLoading false

                    failure: (error) =>
                        console.log(error)
                        Ext.Msg.alert("Fout", "Fout in ophalen van scherm. Error: #{error}")
                        portalWindow.setLoading false

        return true

    initComponent: () ->
        #is deze nog nodig???
        @callParent(arguments)
