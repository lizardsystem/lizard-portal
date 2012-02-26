###
Lizard.window.Screen

Setup for the default viewport of Lizard with a header, (area) navigation on the left and the portals in the center

with the option
showOnlyPortal, only the portal is shown (without the header and left navigation)


The class includes functions to load and activate portals, which are:
linkTo
loadPortal
showNavigationPortalTemplate



###




Ext.define 'Lizard.window.Screen',
    extend:'Ext.container.Viewport'
    config:
        header:
            src_logo: 'vss/stowa_logo.png'
            url_homepage: '/'
            headertabs: []
        context_manager: null
        showOnlyPortal: false
        navigation_tabs: []

    #////
    #linkTo:
    #sets context, which loads portal
    #
    #
    #
    #////
    linkTo:(params, save_state=true, area_selection_collapse=true, skip_animation=false) ->
        console.log('linkTo, with arguments:')
        console.log(arguments)

        Lizard.CM.setContext(params, save_state, false)

        #load portal through
        #@loadPortal(Lizard.CM.getContext(), area_selection_collapse, skip_animation)

    #////
    #linkToNewWindow:
    #open portal in new window
    #
    #
    #
    #////
    linkToNewWindow:(params, save_state=true, area_selection_collapse=true, skip_animation=false) ->
        console.log('linkToNewWindow, with arguments:')
        console.log(arguments)

        args = Ext.Object.merge({}, @context_manager.getContext(), params)
        href = '/portal/only_portal/#'+args.headertab.name+'/'+args.portal_template+'/'+args.object.type + '/' + args.object.id

        window.open( href, args.portal_template + ' ' + args.object.name, 'width=800,height=600,scrollbars=yes')

    #////
    #linkToPopup:
    #open portal in popup (extjs window)
    #
    # todo: werkt dit hetzlefde als de voorgaande functies? context gaan meegeven
    #
    #////
    linkToPopup: (title,url,params,window_options={},add_active_object_to_request=true,renderer='html',modal=false,reloadme=false) ->
        console.log('linkTo, with arguments:')
        console.log(arguments)

        me = @
        if add_active_object_to_request
            cont= Lizard.CM.getContext()

            args = Ext.Object.merge(
                params, {
                    object_id: cont.object.id,
                    object_type: cont.object.type
                })
        if reloadme
            success = reloadGraphs
        else
            success = Ext.emptyFn()

        window_settings = {
            title: title,
            width: 800,
            height: 500,
            autoScroll: true,
            bodyStyle:
                background: 'white'
            modal: modal,
            loader:{
                loadMask: true,
                autoLoad: true,
                url: url,
                ajaxOptions: {
                    method: 'GET'
                },
                params: params
                renderer: renderer
                success: success
            }
        }

        if window_options.save or window_options.search
            window_settings.tools = []
        if window_options.save
            window_settings.tools.push({
                type: 'save',
                handler: (e, target, panelHeader, tool) ->
                    console.log(arguments);
                    me.linkToPopup.apply(me, window_options.save);
            })

        if window_options.search
            window_settings.tools.push({
                type: 'search',
                handler: (e, target, panelHeader, tool) ->
                    console.log(arguments);
                    me.linkToPopup.apply(me, window_options.search);
            })

        Ext.create('Ext.window.Window', window_settings).show();


    #////
    #loadPortal:
    #loads portal or activates already active portal with correct context. set breadcrumb based on settings in
    # the portal templates
    #
    #
    #
    #////
    loadPortal:(params, area_selection_collapse=true, skip_animation=false, show_navigation=true) ->
        console.log "load portal with portal template '#{params.portal_template}' and arguments:"
        console.log arguments

        if show_navigation and params.object and (typeof(params.object.id) in ['null', 'undefined']) and params.headertab.navigation
            @showNavigation(params.headertab.navigation)
            return true

        me = @
        container = @portalContainer
        tab = @portalContainer.child("##{params.portal_template}")

        if tab
            #switch to tab
            pos = @portalContainer.tabBar.items.indexOf(tab.tab)
            if pos > 0
                @portalContainer.tabBar.move(pos,0)

            @portalContainer.setActiveTab(tab)
            #tab.setContext: updates elements inside portal with plugin ApplyContext
            tab.setContext(params)
            @header.setBreadCrumb tab.breadcrumbs
        else
            #load portal and put in tab
            container.setLoading true

            Ext.Ajax.request
                url: '/portal/configuration/',
                params: {portal_template: params.portal_template}
                method: 'GET'
                success: (xhr) =>
                    try
                        newComponent = Ext.decode(xhr.responseText)
                        newComponent.params = Ext.merge({}, newComponent.params, Lizard.CM.getContext())
                        newComponent.headertab = Lizard.CM.context.headertab

                        if area_selection_collapse
                            if me.navigation
                                me.navigation.collapse()

                        tab = me.portalContainer.add newComponent

                        pos = @portalContainer.tabBar.items.indexOf(tab.tab)
                        if pos > 0
                            @portalContainer.tabBar.move(pos,0)
                        me.portalContainer.setActiveTab(tab)

                        tab.on('activate', (tab) ->
                            Lizard.CM.setContext({headertab: tab.headertab, portal_template: tab.params.portal_template})
                        )
                        me.portalContainer.setLoading false
                        me.header.setBreadCrumb(newComponent.breadcrumbs)
                    catch error
                        Ext.Msg.alert("Fout", "Fout in laden scherm. Error: #{error}")
                        me.portalContainer.setLoading false

                failure: (error) =>
                    #response
                    console.log(error)
                    Ext.Msg.alert("Fout", "Fout in ophalen van scherm. Error: #{error}")
                    me.portalContainer.setLoading false

    ####
    # showNavigation:
    # show area selection (left side area selection and navigation)
    # animate does not work in version
    #
    #
    ####
    showNavigation: (navigation_id, animate_navigation_expand=true, expand_navigation=true, show_portal_template=true) ->
        navigation_tab = @navigation.getComponent(navigation_id)
        if not navigation_tab
            console.log('navigation does not exist')
            return false
        if navigation_id and navigation_tab
            @navigation.setActiveTab(navigation_id)
            
            if expand_navigation
                #animate option does not work in version
                @navigation.expand(animate_navigation_expand)
                @navigation.doLayout()

        if show_portal_template
            args = Ext.Object.merge({}, @context_manager.getContext(), {
                        portal_template: navigation_tab.selection_portal_template
                    })
            #send only args to prevent context switch (only temp switch)
            @loadPortal(args, false, false, false)

        return true

    #?????
    showTabMainpage: (animate_navigation_expand=true, expand_navigation=true, show_portal_template=true) ->
        debugger
        opmerking = 'wordt deze nog gebruikt'
        context = Lizard.ContextManager.getContext()
        ht = context.headertab

        if ht.popup_navigation
            @showNavigation(ht.navigation, true, true, ht.popup_navigation_portal)
        else
            @linkTo({portal_template:ht.default_portal_template})

        return true

    #////
    #  _switchNavigation( headertab )
    #  activate navigation tab relevant for this tab and disables other
    #
    #
    #////


    switchNavigation: (headertab) ->
        obj = headertab.object_types

        for tab in @navigation.items.items
            if tab.object_type in obj
                tab.enable()
                @navigation.setActiveTab(tab)
            else
                tab.disable()

        #tempfix because layout is not always correct
        @navigation.doLayout()

    updateOnContextChange: (changes, changed_context, new_context) ->
        @loadPortal(new_context)
        @switchNavigation(new_context.headertab)


    constructor: (config) ->
        @initConfig(config)
        @callParent(arguments)

    initComponent: () ->
        me = @
        
        if @showOnlyPortal

            @header = Ext.create('Lizard.window.Header'
                region: 'north'
                id:'header'
                height: 0
                xtype: 'pageheader'
                context_manager: Lizard.ContextManager
                header_tabs: @header.headertabs
                src_logo: @header.src_logo
                url_homepage: @header.url_homepage
                headertabs: @header.headertabs
                #todo: potential memory leak, because of cross references. add in destroy?
                portalWindow: @
            )

            Ext.apply @,
                id: 'portalWindow',
                layout:
                    type: 'border'
                    #padding: 5
                defaults:
                    collapsible: true
                    floatable: false
                    split: true
                    frame: false
                items:[
                    @header
                    {
                        region: 'center'
                        id: 'portalContainer'
                        collapsible: false
                        plain:true
                        split: false
                        frame: false
                        #layout:'card'
                        xtype: 'tabpanel'
                        tabPosition: 'bottom'
                    }
                ]
        else
            @header = Ext.create('Lizard.window.Header'
                region: 'north'
                id:'header'
                height: 55
                xtype: 'pageheader'
                context_manager: Lizard.ContextManager
                header_tabs: @header.headertabs
                src_logo: @header.src_logo
                url_homepage: @header.url_homepage
                headertabs: @header.headertabs
                #todo: potential memory leak, becase of cross references
                portalWindow: @
            )

            Ext.apply @,
                id: 'portalWindow',
                layout:
                    type: 'border'
                    #padding: 5
                defaults:
                    collapsible: true
                    floatable: false
                    split: true
                    frame: false
                items:[
                    @header
                    {
                        region: 'west'
                        id: 'areaNavigation'
                        title: 'Gebiedsselectie'
                        animCollapse:500
                        width: 250
                        collapsed: true
                        #layout:'card'
                        xtype:'tabpanel'
                        tabPosition: 'bottom'
                        autoScroll: true
                        layout: 'fit'
                        setNavigation: (navigation)->
                            tab = @child(navigation)
                            @setActiveTab(tab)
                        setEnabledNavigations: (navigations) ->
                            debugger
                            
                    }
                    {
                        region: 'center'
                        id: 'portalContainer'
                        collapsible: false
                        plain:true
                        split: false
                        frame: false
                        #layout:'card'
                        xtype: 'tabpanel'
                        tabPosition: 'bottom'

                    }
                ]

        @callParent(arguments)

        #set references after creation
        if not @showOnlyPortal
            @navigation = Ext.getCmp('areaNavigation')
            for navig in @navigation_tabs
                @navigation.add navig
        @portalContainer = Ext.getCmp('portalContainer')




        return @

    afterRender: ->
        @callParent(arguments)

        #when url has some kind of status information, set context
        if window.location.hash
            hash = window.location.hash
            parts = hash.replace('#', '').split('/');
            Lizard.CM.setContext({
                headertab: parts[0]
                portal_template: parts[1]
                object: {
                    type: parts[2]
                    id: parts[3]
                }
            }, false, true, false)


        if not @showOnlyPortal
            #set navigation of active tab
            activetab = Lizard.CM.context.headertab

            if activetab.popup_navigation and not Lizard.CM.context.object.id
                console.log('no object selected, show selection')
                #show navigation and selection
                #false argument for animation doesn work in extjs 4.0.2, so set animCollapse setting before animation and
                #reset to original value afterwards
                anim_setting = @navigation.animCollapse
                @navigation.animCollapse = false
                #todo, anders: @context_manager.showNavigationIfNeeded(false)
                @navigation.animCollapse =  anim_setting

        Lizard.CM.on('contextchange', @updateOnContextChange, @)

        @loadPortal(Lizard.CM.getContext())
        @switchNavigation(Lizard.CM.context.headertab)

