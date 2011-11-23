Ext.define 'Lizard.window.Screen',
    extend:'Ext.container.Viewport'
    config:
        area_selection_template: 'aan_afvoergebied_selectie',
        area_store: 'Vss.store.CatchmentTree'

        header:
            src_logo: 'vss/stowa_logo.png'
            url_homepage: '/'
            tabs: []
            active_tab: ''
        user: ''
        lizard_context:
            period_start: '2000-01-01T00:00'
            period_end: '2002-01-01T00:00'
            object: 'aan_afvoergebied'
            object_id: null
            portalTemplate:'homepage'
            base_url: 'portal/watersysteem'


    setBreadCrumb:(bread_crumbs) ->

        header = Ext.getCmp('header')
        header.setBreadCrumb(arguments)

    linkTo:(options, save_state=true, area_selection_collapse=true, skip_animation=false) ->
        @setContext(options, save_state)
        @loadPortal(@lizard_context, area_selection_collapse, skip_animation)

    setContext:(options, save_state=true) ->
        @setLizard_context(Ext.merge(@.getLizard_context(), options))

        if save_state
            try
                window.history.pushState(@lizard_context, "#{options}", "#{@lizard_context.base_url}##{@lizard_context.portalTemplate}/#{@lizard_context.object}/#{@lizard_context.object_id}")
            catch error
                console.log "not able to set pushState"

    loadPortal:(params, area_selection_collapse=true, skip_animation=false) ->
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

    showAreaSelection: () ->
        navigation = Ext.getCmp 'areaNavigation'
        navigation.expand()
        arguments = Ext.Object.merge({}, @lizard_context, {portalTemplate: @area_selection_template})
        @loadPortal(arguments, false)

    constructor: (config) ->
        @initConfig(config)
        @callParent(arguments)
    initComponent: () ->
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
                {
                    region: 'north'
                    id:'header'
                    height: 55
                    xtype: 'pageheader'
                    tabs: me.getHeader().tabs
                    user: me.getUser()
                    active_tab: me.getHeader().active_tab
                }
                {
                    region: 'west'
                    id: 'areaNavigation'
                    title: 'Navigatie'
                    animCollapse:500
                    width: 250
                    autoScroll: true
                    frame: false
                    collapsed: true
                    #layout:'card'
                    xtype:'tabpanel'
                }

                {
                    region: 'center'
                    collapsible: false
                    floatable: false
                    tabPosition: 'bottom'
                    plain:true
                    split: false
                    #layout:'card'
                    xtype: 'tabpanel'
                    id: 'app-portal'
                }
                {
                    region: 'east'
                    width:300
                    title: 'Analyse'
                    collapsible: true
                    floatable: false
                    tabPosition: 'bottom'
                    collapsed:true
                    plain:true
                    split: true
                    #layout:'card'
                    xtype: 'tabpanel'
                    id: 'analyse'
                    items:[
                        {title:'Eco'}
                        {
                            title:'WQ',
                            id: 'analyse_form',
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            #xtype:'form',
                            autoScroll: true,
                            bbar:['save']


                            items:[

                                {
                                    fieldLabel: 'titel'
                                    xtype: 'textfield'
                                }
                                {
                                    fieldLabel: 'label'
                                    store: [1,2,3,4,5,6,7,8,9,10]
                                    xtype: 'combo'
                                    multiSelect: true
                                    forceSelection: true
                                }
                                {
                                    fieldLabel: 'label'
                                    store: {
                                        fields: [
                                            {
                                                name: 'id',

                                            },{
                                                name: 'text',

                                            }
                                        ]
                                    }
                                    xtype: 'gridpanel'
                                    columns: [{
                                        text: 'Gebieden',
                                        dataIndex: 'text'
                                        flex:1
                                    }]
                                    height: 100,
                                    viewConfig: {
                                        plugins: {
                                            ptype: 'gridviewdragdrop',
                                            dropGroup: 'firstGridDDGroup'
                                        }
                                    }

                                }
                                {
                                    title:'text',
                                    xtype: 'htmleditor'
                                    height: 200
                                    #resizable: true
                                }
                            ]
                        }
                    ]
                }
            ]
                
        @callParent(arguments)
        return @
    afterRender: ->
        @callParent(arguments)

        activeTab = Ext.getCmp('header').getActiveTab()
        Ext.getCmp('areaNavigation').add(activeTab.navigation)



        if window.location.hash
            hash = window.location.hash
            parts = hash.replace('#', '').split('/');
            Ext.getCmp('portalWindow').linkTo({
                portalTemplate: parts[0]
                object: parts[1]
                object_id: parts[2]
            }, false, true, false)
        

        if @getLizard_context().object_id == null
            navigation = Ext.getCmp 'areaNavigation'
            #false argument for animation doesn work in extjs 4.0.2, so set animCollapse setting before animation and
            #reset to original value afterwards
            anim_setting = navigation.animCollapse
            navigation.animCollapse =  false
            navigation.expand(false)
            navigation.animCollapse =  anim_setting
            @showAreaSelection(false)

