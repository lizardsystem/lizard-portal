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
                url: '/portal/example_treedata.json'
                extraParams:
                    isJSON: true
                reader:
                    type: 'json'
            root:
                expanded: true
                children: [
                        {text: "Tekst A", leaf: true}
                        {text: "Tekst B", expanded: true, children: [
                            {text: "tekst 2", leaf: true}
                            {text: "tekst 3", leaf: true}
                            {text: "tekst 4", leaf: false}
                            ]}
                    ]
    

    loadPortal:(node) ->
        if node.leaf
            alert 'node'
        container = Ext.getCmp 'app-portal';
        container.setLoading true
        container.removeAll()
        
        Ext.Ajax.request
            url: '/portal/example_portal.json',
            success: (xhr) =>
                newComponent = eval xhr.responseText
                navigation = Ext.getCmp 'areaNavigation'
                navigation.collapse()
                container.add newComponent
                container.setLoading false
                
            failure: =>
                Ext.Msg.alert "Grid creation failed", "Server communication failure"
                container.setLoading false
        
    linkTo: () ->
        
    initComponent: (arguments) ->
        content = '<div class="portlet-content">hier moet iets komen</div>'

        Ext.apply this,
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
                {region: 'west'
                id: 'areaNavigation'
                animCollapse:500
                xtype: 'treepanel'
                title: 'Navigatie'
                frame: false
                width: 250
                autoScroll: true
                listeners:
                    itemclick:
                        fn: this.loadPortal
                store: this.getStore()
                bbar: [
                    text: 'Selecteer op kaart -->'
                    border: 1
                    handler: ->
                        alert 'Laat nu kaart zien'
                    ]}
    
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
