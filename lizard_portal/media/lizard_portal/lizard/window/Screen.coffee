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

    ####
    #linkTo:
    #sets context and load portal
    #
    #
    #
    ####
    linkTo:(params, save_state=true, area_selection_collapse=true, skip_animation=false) ->
        console.log('linkTo, with arguments:')
        console.log(arguments)

        @context_manager.setContext(params, save_state)
        #if @header
        #    @header.updateContextHeader()
        @loadPortal(@context_manager.getContext(), area_selection_collapse, skip_animation)

   ####
    #linkToNewWindow:
    #open portal in new window
    #
    #
    #
    ####
    linkToNewWindow:(params, save_state=true, area_selection_collapse=true, skip_animation=false) ->
        console.log('linkTo, with arguments:')
        console.log(arguments)

        args = Ext.Object.merge({}, @context_manager.getContext(), params)

        window.open('/portal/only_portal/#'+args.active_headertab.name+'/'+args.portalTemplate+'/'+args.object_type + '/' + args.object_id )


   ####
    #linkToPopup:
    #open portal in popup (extjs window)
    #
    #
    #
    ####
    linkToPopup:(title, url, params, add_active_object=true, modal=false) ->
        console.log('linkTo, with arguments:')
        console.log(arguments)

        cont= @context_manager.getContext()

        args = Ext.Object.merge(params, {object_id:cont.object_id, object_type: cont.object_type})

        Ext.create('Ext.window.Window', {
            title: title,
            width: 800,
            height: 600,
            modal: modal,
            loader:{
                loadMask: true,
                autoLoad: true,
                url: url,
                ajaxOptions: {
                    method: 'GET'
                },
                params: params,
                renderer: 'component'
            }
        }).show();


    ####
    #loadPortal:
    #loads portal or activates already active portal with correct context. set breadcrumb based on settings in
    # the portal templates
    #
    #
    #
    ####
    loadPortal:(params, area_selection_collapse=true, skip_animation=false) ->
        console.log "load portal with portalTemplate '#{params.portalTemplate}' and arguments:"
        console.log arguments

        me = @
        container = @portalContainer
        tab = @portalContainer.child("##{params.portalTemplate}")

        if tab
            #switch to tab
            @portalContainer.setActiveTab(tab)

            tab.setContext(params)
            @header.setBreadCrumb tab.breadcrumbs
        else
            #load portal and put in tab
            container.setLoading true

            #todo: change method in window.load()
            Ext.Ajax.request
                url: '/portal/configuration/',
                params: {portalTemplate: params.portalTemplate}
                method: 'GET'
                success: (xhr) =>
                    try
                        newComponent = Ext.decode(xhr.responseText)
                        newComponent.params = Ext.merge({}, newComponent.params, me.context_manager.getContext())

                        if area_selection_collapse
                            if me.navigation
                                me.navigation.collapse()

                        tab = me.portalContainer.add newComponent
                        me.portalContainer.setActiveTab(tab)
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
                        portalTemplate: navigation_tab.selection_portal_template
                    })
            #send only args to prevent context switch (only temp switch)
            @loadPortal(args, false)

        return true


    showTabMainpage: (animate_navigation_expand=true, expand_navigation=true, show_portal_template=true) ->
        context = @context_manager.getContext()
        ht = context.active_headertab

        if ht.popup_navigation
            @showNavigation(ht.navigation, true, true, ht.popup_navigation_portal)
        else
            @linkTo({portalTemplate:ht.default_portal_template})

        return true

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
                context_manager: @getContext_manager()
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
                context_manager: @getContext_manager()
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
                        title: 'Navigatie'
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
            @linkTo({
                headerTab: parts[0]
                portalTemplate: parts[1]
                object_type: parts[2]
                object_id: parts[3]
            }, false, true, false)


        if not @showOnlyPortal
            #set navigation of active tab
            activeTab = @context_manager.getActive_headertab()

            if activeTab.popup_navigation and not @context_manager.getContext().object_id
                console.log('no object selected, show selection')
                #show navigation and selection
                #false argument for animation doesn work in extjs 4.0.2, so set animCollapse setting before animation and
                #reset to original value afterwards
                anim_setting = @navigation.animCollapse
                @navigation.animCollapse = false
                @context_manager.showNavigationIfNeeded(false)
                @navigation.animCollapse =  anim_setting
