
Ext.define 'Lizard.window.Dashboard',
    extend:'Ext.container.Viewport'
    uses: ['Lizard.portlet.Portlet',
            'Lizard.portlet.PortalPanel',
            'Lizard.portlet.PortalColumn',
            'Lizard.portlet.GridPortlet',
            'Lizard.portlet.ChartPortlet',
            'GeoExt.MapPanel',
            'Ext.Img',
            'Ext.grid.property.Grid',
            'Ext.data.Model',
            'Ext.data.TreeStore',
            'Ext.tree.Panel',
            #'GeoExt.data.LayerStore',
            #'GeoExt.data.LayerRecord',
            #'GeoExt.data.LayerReader',
            'Ext.MessageBox']
    config:
        special: true
        
    getStore: ->
        Ext.create 'Ext.data.TreeStore' 
            proxy: 
                type: 'ajax'
                url: '/portal/example_treedata.json'
                extraParams:
                    isJSON: true
                reader:
                    type: 'json'
            root:
                expanded: true
                children: [
                        {id: 1, text: "Tekst A", leaf: true}
                        {id: 2, text: "Tekst B", expanded: true, children: [
                            {id: 3, text: "tekst 2", leaf: true}
                            {id: 4, text: "tekst 3", leaf: true}
                            {id: 5, text: "tekst 4", leaf: false}
                            ]}
                    ]
    

    
    
    loadPortal:(params) ->
        console.log params
        console.log "portalTemplate:" + params.portalTemplate
        container = Ext.getCmp 'app-portal'
        container.setLoading true
        container.removeAll()
        
        Ext.Ajax.request
            url: '/portal/configuration/',
            params: params
            method: 'GET'
            success: (xhr) =>
                newComponent = eval 'eval( ' + xhr.responseText + ')'
                navigation = Ext.getCmp 'areaNavigation'
                navigation.collapse()
                container.add newComponent
                container.setLoading false

            failure: =>
                Ext.Msg.alert "portal creation failed", "Server communication failure"
                container.setLoading false


    linkTo:(options, save_state=true) ->
        console.log options
        @lizard_context = Ext.Object.merge(@lizard_context, options)
        if save_state
          window.history.pushState(@lizard_context, "#{options}", "/portal/#{@lizard_context.portalTemplate}/#{@lizard_context.area}")
        @loadPortal(@lizard_context)
        
    initComponent: (arguments) ->
        content = '<div class="portlet-content">hier moet iets komen</div>'

        Ext.apply @,
            id: 'portalWindow',
            lizard_context:
                period_start:'2000-01-01T00:00'
                period_end: '2002-01-01T00:00'
                area: null
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
                                @linkTo {area: node.data.id}
                    store: @getStore()
                    bbar: [
                        text: 'Selecteer op kaart -->'
                        border: 1
                        handler: ->
                            alert 'Laat nu kaart zien'
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
        Ext.Ajax.request
            url: '/ui/examples/'
            success: (response, opts) ->
                obj = Ext.decode response.responseText
                console.log "------------>"
                console.log obj 
            failure: (response, opts) ->
                console.log "Server-side failure with status code #{response.status}"

        header = Ext.get 'header'
        console.log header
        Ext.get('test').replace header

    onPortletClose: (portlet) ->
        @showMsg @portlet.title + " was removed"


    showMsg: (msg) ->
        el = Ext.get 'app-msg'
        msgId = Ext.id()
        
        @msgId = msgId
        
        el.update(msg).show()
        
        Ext.defer @clearMsg, 3000, @, [msgId]


    clearMsg: (msgId) ->
        if msgId is @msgId
            Ext.get('app-msg').hide()

    getTools: ->
        [
            xtype: 'tool',
            type: 'gear',
            handler: (e, target, panelHeader, tool) ->
                portlet = panelHeader.ownerCt
                portlet.setLoading 'Working...'
                Ext.defer ( ->
                    portlet.setLoading false
                ), 2000
                
            ]


    # @loadPortal()
