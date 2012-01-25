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

    ###
    #setBreadCrumb:
    #sets breadcrumb of header (reference to function of header)
    #
    #
    #
    ####
    setBreadCrumb:(bread_crumbs) ->
        if @header
            @header.setBreadCrumb(bread_crumbs)

    ###
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
        if @header
            @header.updateContextHeader()
        @loadPortal(@context_manager.getContext(), area_selection_collapse, skip_animation)

    ###
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
            @setBreadCrumb tab.breadcrumbs
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
                        me.setBreadCrumb(newComponent.breadcrumbs)
                    catch error
                        Ext.Msg.alert("Fout", "Fout in laden scherm. Error: #{error}")
                        me.portalContainer.setLoading false

                failure: =>
                    Ext.Msg.alert("Fout", "Fout in ophalen van scherm. Error: #{error}")
                    me.portalContainer.setLoading false

    ###
    # showNavigationPortalTemplate:
    # show area selection (left side area selection and navigation)
    # animate does not work in version
    #
    #
    ####
    showNavigationPortalTemplate: (animate_navigation_expand, expand_navigation=true) ->

        if expand_navigation
            @navigation.expand(animate_navigation_expand)
        args = Ext.Object.merge({}, @context_manager.getContext(), {portalTemplate: @context_manager.active_headertab.navigation_portal_template})
        #send only args to prevent context switch (only temp switch)
        @loadPortal(args, false)

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
                            tab = @child("##{navigation.id}")
                            if not tab
                                tab = @add navigation
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
            if activeTab
                tab = @navigation.add activeTab.navigation
                @navigation.setActiveTab tab


            if not @context_manager.getContext().object_id
                console.log('no object selected, show selection')
                #show navigation and selection
                #false argument for animation doesn work in extjs 4.0.2, so set animCollapse setting before animation and
                #reset to original value afterwards
                anim_setting = @navigation.animCollapse
                @navigation.animCollapse =  false
                @navigation.expand(false)
                @navigation.animCollapse =  anim_setting
                @showNavigationPortalTemplate(false)
