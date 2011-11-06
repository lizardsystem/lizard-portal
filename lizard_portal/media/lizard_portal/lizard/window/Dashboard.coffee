Ext.define 'Lizard.window.Dashboard',
    extend:'Ext.container.Viewport'
    config:
        area_selection_template: 'aan_afvoergebied_selectie',
        area_store: 'Vss.store.CatchmentTree'
        lizard_context:
            period_start: '2000-01-01T00:00'
            period_end: '2002-01-01T00:00'
            object: 'aan_afvoergebied'
            object_id: null
            portalTemplate:'homepage'
            base_url: 'portal/watersysteem'


    setBreadCrumb:(bread_crumbs) ->
        me = this
        bread_div = Ext.get('breadcrumbs')

        a = bread_div.down('div')
        while a
            a.remove()
            a = bread_div.down('div')

        a = bread_div.down('a')
        while a
            a.remove()
            a = bread_div.down('a')

        element = {
            tag: 'div',
            cls: 'link',
            html: 'aan-afvoergebied'
        }

        bread_div.createChild(element)
        el = bread_div.last()
        el.addListener('click',
                        () ->
                            me.showAreaSelection()
        )

        if bread_crumbs
            bread_div.createChild({
                tag: 'div',
                html: ' - '
            })
            for crumb in bread_crumbs
                if crumb.link
                    element = {
                        tag: 'div',
                        cls: 'link',
                        html: crumb.name
                    }

                    bread_div.createChild(element)
                    el = bread_div.last()
                    el.addListener('click'
                                   (evt, obj, crumb_l) ->
                                        me.linkTo({portalTemplate: crumb_l.link})
                                   @,
                                   crumb)
                    bread_div.createChild({
                        tag: 'div',
                        html: ' - '
                    })
                else
                    bread_div.createChild({
                        tag: 'div',
                        html: crumb.name
                    })

    linkTo:(options, save_state=true) ->
        @setContext(options, save_state)
        @loadPortal(@lizard_context)

    setContext:(options, save_state=true) ->
        @setLizard_context(Ext.merge(@.getLizard_context(), options))

        if save_state
            try
                window.history.pushState(@lizard_context, "#{options}", "/#{@lizard_context.base_url}/##{@lizard_context.portalTemplate}/#{@lizard_context.object}/#{@lizard_context.object_id}")
            catch error
                console.log "not able to set pushState"

    loadPortal:(params, area_selection_collapse=true) ->
        console.log "portalTemplate:" + params.portalTemplate
        console.log params

        me = @

        container = Ext.getCmp 'app-portal'

        tab = container.child("##{params.portalTemplate}")

        if tab
            #switch to tab
            container.setActiveTab(tab)
            tab.setContext(params)
            console.log('check')
            @setBreadCrumb tab.breadcrumbs
            console.log('check')
        else
            #load portal and put in tab
            container.setLoading true
            #container.removeAll(true)
            console.log('check')
            Ext.Ajax.request
                url: '/portal/configuration/',
                params: params
                method: 'GET'
                success: (xhr) =>
                    newComponent = eval 'eval( ' + xhr.responseText + ')'
                    console.log('check')
                    newComponent.params = Ext.merge({}, newComponent.params, me.getLizard_context())
                    if area_selection_collapse
                        navigation = Ext.getCmp 'areaNavigation'
                        navigation.collapse()
                    tab = container.add newComponent
                    container.setActiveTab(tab)
                    container.setLoading false
                    console.log('check')
                    me.setBreadCrumb newComponent.breadcrumbs
                    console.log('check')


                failure: =>
                    Ext.Msg.alert "portal creation failed", "Server communication failure"
                    container.setLoading false

    showAreaSelection: ->
        arguments = Ext.Object.merge({}, @lizard_context, {portalTemplate: @area_selection_template})
        @loadPortal(arguments, false)

    constructor: (config) ->
        @initConfig(config)
        @callParent(arguments)
    initComponent: (arguments) ->
        me = @

        Ext.apply @,
            id: 'portalWindow',
            layout:
                type: 'border'
                #padding: 5
            defaults:
                collapsible: true
                floatable: true
                split: true
                frame: true
            items:[
                {region: 'north'
                collapsible: false
                floatable: false
                split: false
                frame:false
                border:false
                items:
                    id:'header'
                    height: 55
                    html: ""
                }
                {
                    region: 'west'
                    id: 'areaNavigation'
                    animCollapse:500
                    xtype: 'treepanel'
                    title: 'Navigatie'
                    frame: false
                    width: 250
                    autoScroll: true
                    listeners:
                        itemclick:
                            fn: (tree, node) =>
                                @linkTo {object_id: node.data.id}
                    store: me.area_store
                    bbar: [
                        text: 'Selecteer op kaart -->'
                        border: 1
                        handler: ->
                            me.showAreaSelection()
                        ]
                }

                {region: 'center'
                collapsible: false
                floatable: false
                tabPosition: 'bottom'
                plain:true
                split: false
                #layout:'card'
                xtype: 'tabpanel'
                id: 'app-portal'}]
                
        @callParent(arguments)
        return @
    afterRender: ->
        @callParent(arguments)
        Ext.get('header').load
            url: '/portalheader/'
            scripts: true
        if window.location.hash
            hash = window.location.hash
            parts = hash.replace('#', '').split('/');
            Ext.getCmp('portalWindow').linkTo({
                portalTemplate: parts[0]
                object: parts[1]
                object_id: parts[2]
            }, false)
        

        if @getLizard_context().object_id == null
            @showAreaSelection()

