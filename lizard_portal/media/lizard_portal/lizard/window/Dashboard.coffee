Ext.define 'Lizard.window.Dashboard',
    extend:'Ext.container.Viewport'

    config:
        area_selection_template:'aan_afvoergebied_selectie',
        lizard_context:
            period_start:'2000-01-01T00:00'
            period_end: '2002-01-01T00:00'
            object: 'aan_afvoergebied'
            object_id: null
            portalTemplate:'homepage'
            base_url: 'portal/watersysteem'
            activeOrganisation: [1,2]


    linkTo:(options, save_state=true) ->
        @setContext(options, save_state)
        @loadPortal(@lizard_context)

    setContext:(options, save_state=true) ->
        console.log options
        console.log @getLizard_context()

        @setLizard_context(Ext.Object.merge(@.getLizard_context(), options))

        if save_state
            try
                window.history.pushState(@lizard_context, "#{options}", "/#{@lizard_context.base_url}/##{@lizard_context.portalTemplate}/#{@lizard_context.object}/#{@lizard_context.object_id}")
            catch error
                console.log "not able to set pushState"

    loadPortal:(params, area_selection_collapse=true) ->
        console.log params
        console.log "portalTemplate:" + params.portalTemplate
        container = Ext.getCmp 'app-portal'
        container.setLoading true
        container.removeAll(true)
        maps = Ext.ComponentQuery.query("gx_mappanel")
        if maps.length > 0
          maps[0].map.destroy()

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
        arguments = Ext.Object.merge({}, @lizard_context, {portalTemplate: @area_selection_template})
        @loadPortal(arguments, false)

    constructor: (config) ->
        @initConfig(config)

        Lizard.window.Dashboard.superclass.constructor.apply @

    initComponent: (arguments) ->
        content = '<div class="portlet-content">hier moet iets komen</div>'

        Ext.create(GeoExt.data.LayerStore,
            layers: [
                new OpenLayers.Layer.OSM()
                new OpenLayers.Layer.WMS('Waterlopen', 'http://maps.waterschapservices.nl/wms?namespace=inspire',{
                        layers:['HY.PhysicalWaters.Waterbodies'],
                        transparent: "true",
                        format: "image/png"
                    },{
                        singleTile: true,
                        displayOutsideMaxExtent: true,
                        projection: new OpenLayers.Projection("EPSG:900913")

                    }
                )
                new OpenLayers.Layer.WMS('Kunstwerken', 'http://maps.waterschapservices.nl/wms?namespace=inspire',{
                        layers:['HY.PhysicalWaters.ManMadeObject'],
                        transparent: "true",
                        format: "image/png"
                    },{
                        singleTile: true,
                        displayOutsideMaxExtent: true,
                        projection: new OpenLayers.Projection("EPSG:900913")

                    }
                )
                ],
            storeId:'Layers'
        )

        Ext.apply @,
            id: 'portalWindow',
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

