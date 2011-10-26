Ext.define 'Lizard.window.Dashboard',
    extend:'Ext.container.Viewport'

    config:
        special: true

    linkTo:(options, save_state=true) ->
        @setContext(options, save_state)
        @loadPortal(@lizard_context)

    setContext:(options, save_state=true) ->
        console.log options
        console.log @lizard_context
        @lizard_context = Ext.Object.merge(@lizard_context, options)
        if save_state
            window.history.pushState(@lizard_context, "#{options}", "/portal/##{@lizard_context.portalTemplate}/#{@lizard_context.object}/#{@lizard_context.object_id}")

    loadPortal:(params, area_selection_collapse=true) ->
        console.log params
        console.log "portalTemplate:" + params.portalTemplate
        container = Ext.getCmp 'app-portal'
        container.setLoading true
        container.removeAll(true)

        Ext.Ajax.request
            url: '/portal/configuration/',
            params: params
            method: 'GET'
            success: (xhr) =>
                newComponent = eval 'eval( ' + xhr.responseText + ')'
                if area_selection_collapse
                  navigation = Ext.getCmp 'areaNavigation'
                  navigation.collapse()
                container.add newComponent
                container.setLoading false

            failure: =>
                Ext.Msg.alert "portal creation failed", "Server communication failure"
                container.setLoading false

    showAreaSelection: ->
        arguments = Ext.Object.merge({}, @lizard_context, {portalTemplate: 'aan_afvoergebied_selectie'})
        @loadPortal(arguments, false)

    initComponent: (arguments) ->
        content = '<div class="portlet-content">hier moet iets komen</div>'

        Ext.apply @,
            id: 'portalWindow',
            lizard_context:
                period_start:'2000-01-01T00:00'
                period_end: '2002-01-01T00:00'
                object: 'aan_afvoergebied'
                object_id: null
                portalTemplate:'homepage'
                activeOrganisation: [1,2]

            layout:
                type: 'border'
                padding: 5
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
                    height: 60
                    html: ""
                height: 60}
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
                    store: 'Vss.store.CatchmentTree'
                    bbar: [
                        text: 'Selecteer op kaart -->'
                        border: 1
                        handler: ->
                            Ext.getCmp('portalWindow').showAreaSelection()
                        ]
                }

                {region: 'center'
                collapsible: false
                floatable: false
                split: false
                id: 'app-portal'}]

        Lizard.window.Dashboard.superclass.initComponent.apply @, arguments
        return @
    afterRender: ->
        Lizard.window.Dashboard.superclass.afterRender.apply @, arguments
        Ext.get('header').load
            url: '/portal/portalheader/'
            scripts: true

        if @lizard_context.object_id == null
            @showAreaSelection()

        # Ext.Ajax.request
        #     url: '/ui/examples/'
        #     success: (req) ->
        #         Ext.DomHelper.overwrite('header', req.responseText)





    # @loadPortal()
