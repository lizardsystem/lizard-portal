Ext.define 'Lizard.window.Screen',
    extend:'Ext.container.Viewport'
    config:
        header:
            src_logo: 'vss/stowa_logo.png'
            url_homepage: '/'
            headertabs: []
        context_manager: null

    setBreadCrumb:(bread_crumbs) ->
        @header.setBreadCrumb(bread_crumbs)

    linkTo:(params, save_state=true, area_selection_collapse=true, skip_animation=false) ->
        console.log('linkTo, with params:')
        console.log(params)
        @context_manager.setContext(params, save_state)
        console.log('linkTo, after setContext context is:')
        console.log(@context_manager.getContext())
        console.log  @header
        @header.updateContextHeader()
        @loadPortal(@context_manager.getContext(), area_selection_collapse, skip_animation)

    loadPortal:(params, area_selection_collapse=true, skip_animation=false) ->
        console.log "load portal with portalTemplate '#{params.portalTemplate}' and params:"
        console.log params

        me = @

        container = @portalContainer
 
        tab = @portalContainer.child("##{params.portalTemplate}")

        if tab
            #switch to tab
            @portalContainer.setActiveTab(tab)
            tab.setContext(params) #todo: error
            @setBreadCrumb tab.breadcrumbs
        else
            #load portal and put in tab
            container.setLoading true

            #todo: change method in window.load()
            Ext.Ajax.request
                url: '/portal/configuration/',
                params: params
                method: 'GET'
                success: (xhr) =>
                    newComponent = eval 'eval( ' + xhr.responseText + ')'
                    newComponent.params = Ext.merge({}, newComponent.params, me.context_manager.getContext())
                    console.log('params of new component are:')
                    console.log newComponent.params
                    if area_selection_collapse
                        me.navigation.collapse()
                    tab = me.portalContainer.add newComponent
                    me.portalContainer.setActiveTab(tab)
                    me.portalContainer.setLoading false
                    me.setBreadCrumb(newComponent.breadcrumbs)

                failure: =>
                    Ext.Msg.alert "portal creation failed", "Server communication failure"
                    me.portalContainer.setLoading false

    showNavigationPortalTemplate: (animate_navigation_expand) ->
        #animate does not work in version
        @navigation.expand(animate_navigation_expand)
        args = Ext.Object.merge({}, @context_manager.getContext(), {portalTemplate: @context_manager.active_headertab.navigation_portal_template})
        @loadPortal(args, false)

    constructor: (config) ->
        @initConfig(config)
        @callParent(arguments)

    initComponent: () ->
        me = @

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
#                {
#                    region: 'east'
#                    id: 'analyse'
#                    title: 'Analyse'
#                    width:300
#                    floatable: true
#                    collapsed:true
#                    #layout:'card'
#                    xtype: 'tabpanel'
#                    tabPosition: 'bottom'
#                }
            ]

        @callParent(arguments)

        #set references after creation
        @navigation = Ext.getCmp('areaNavigation')
        @portalContainer = Ext.getCmp('portalContainer')

        return @

    afterRender: ->
        @callParent(arguments)

        #set navigation of active tab
        activeTab = @context_manager.getActive_headertab()
        if activeTab
            tab = @navigation.add activeTab.navigation
            @navigation.setActiveTab tab


        #when url has some kind of status information, set context
        if window.location.hash
            hash = window.location.hash
            parts = hash.replace('#', '').split('/');
            @linkTo({
                portalTemplate: parts[0]
                object: parts[1]
                object_id: parts[2]
            }, false, true, false)
        

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

