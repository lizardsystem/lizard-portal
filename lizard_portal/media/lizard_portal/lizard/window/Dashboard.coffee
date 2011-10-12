Ext.define 'Lizard.window.Dashboard', 
    extend:'Ext.container.Viewport'
    uses: ['Lizard.portlet.Portlet',
            'Lizard.portlet.PortalPanel',
            'Lizard.portlet.PortalColumn',
            'Lizard.portlet.GridPortlet',
            'Lizard.portlet.ChartPortlet',
            'Lizard.container.Header']
    config:
        special: true
        
    getStore: ->
        Ext.create 'Ext.data.TreeStore' 
            proxy: 
                type: 'ajax'
                url: '/portal/configuration/test/'
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
        container = Ext.getCmp 'app-portal'
        container.setLoading true
        container.removeAll()
        
        Ext.Ajax.request
            url: '/portal/configuration/test/',
            params: params
            method: 'GET'
            success: (xhr) =>
                newComponent = eval 'eval( ' + xhr.responseText + ')'
                navigation = Ext.getCmp 'areaNavigation'
                navigation.collapse()
                container.add newComponent
                container.setLoading false
                
            failure: =>
                Ext.Msg.alert "Grid creation failed", "Server communication failure"
                container.setLoading false


    linkTo:(options) ->
        console.log options
        #console.log lizard_context
        #@lizard_context = Ext.Object.merge(@lizard_context, options)
        #@loadPortal(@lizard_context)  
        @loadPortal(options)
        
        
    initComponent: (arguments) ->
        content = '<div class="portlet-content">hier moet iets komen</div>'

        Ext.apply this,
            id: 'portalWindow',
            lizard_context:
                period: 
                    start: '2000-01-01T00:00'
                    end: '2002-01-01T00:00'
                area: null
                portalTemplate:1
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
                            fn: (node) =>
                                this.linkTo node.id
                    store: this.getStore()
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

        Lizard.window.Dashboard.superclass.initComponent.apply this, arguments
        return this

    onPortletClose: (portlet) ->
        this.showMsg this.portlet.title + " was removed"


    showMsg: (msg) ->
        el = Ext.get 'app-msg'
        msgId = Ext.id()
        
        this.msgId = msgId
        
        el.update(msg).show()
        
        Ext.defer this.clearMsg, 3000, this, [msgId]


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
