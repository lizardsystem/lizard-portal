#
#  base class for edit summary input
#
#  usage:
#    Lizard.window.EditSummaryBox.show(
#        fn: (btn, text, field)  ->
#             if (btn=='ok')
#                 me.store.setTempWriteParams({edit_message: text})
#                 me.saveEdits()
#             return true
#    )
#

Ext.define('Lizard.window.MapWindow',
    extend:'Ext.window.Window'
    #alias: 'widget.mapwindow'

    title: 'Kaart'
    layout: {
        type: 'vbox',
        align: 'stretch'
    }
    height: 600,
    #////
    # mapeditor
    # include edit possibilities in map
    #////
    mapeditor: true
    #////
    # force_type_selection
    # if the edited geometry must be of one type (polygon/ line, point)
    #////
    force_type_selection: true
    #////
    # edit_point, edit_line, edit_polygon
    # allowed geometries for editing
    #////
    edit_point: true
    edit_line: true
    edit_polygon: true



    statics:
        show: (config={}) ->
            map_windows = []
            if config.window_ref
                #reference by name. if window with same reference exist, this window is used
                map_windows = Ext.WindowManager.getBy((obj) ->
                    if obj.window_ref = config.window_ref
                        return true
                    else
                        return false
                )

            if map_windows.length > 0
                map_window = map_windows[0]
                Ext.WindowManager.bringToFront(map_window)
            else
                map_window = Ext.create('Lizard.window.MapWindow', config).show()

    start_geometry: 'MULTIPOINT(2 2, 3 3, 4 4)'

    format: new OpenLayers.Format.WKT(),

    serialize: (features) ->
        for feature in features
            feature.geometry.transform(
                new OpenLayers.Projection("EPSG:900913"),
                new OpenLayers.Projection("EPSG:4326"));
        # Make a single feature out of the features, because we don't want
        # the serializer to create geometrycollections. Geoserver / PostGis
        # doesn't like them when doing feature requests.
        if @active_edit_layer == @points
            MultiGeometry = OpenLayers.Geometry.MultiPoint
        if @active_edit_layer == @lines
            MultiGeometry = OpenLayers.Geometry.MultiLineString
        if @active_edit_layer == @polygons
            MultiGeometry = OpenLayers.Geometry.MultiPolygon

        single_feature = new OpenLayers.Feature.Vector(
            new MultiGeometry(
                f.geometry for f in features
            )
        )
        str = @format.write single_feature
        return str

    deserialize: (features_string) ->

        features = @format.read(features_string);

        if features.geometry
            @geometry_type = features.geometry.CLASS_NAME
        else if features[0].geometry
            @geometry_type = features[0].geometry.CLASS_NAME

        if features
            if features.constructor != Array
                features = [features]

            final_features = []
            for feature in features
                feature.geometry.transform(
                    new OpenLayers.Projection("EPSG:4326"),
                    new OpenLayers.Projection("EPSG:900913"));
                if feature.geometry.CLASS_NAME in [
                    'OpenLayers.Geometry.MultiPoint'
                    'OpenLayers.Geometry.MultiLineString'
                    'OpenLayers.Geometry.MultiPolygon'
                ]
                    for elem in feature.geometry.components
                        final_features = final_features.concat(new OpenLayers.Feature.Vector(elem))
                else
                    final_features = final_features.concat(feature)
            features = final_features


            bounds = new OpenLayers.Bounds()
            if @start_extent
                bounds.extend(
                    OpenLayers.Bounds.fromArray(
                        @start_extent
                    )
                )

            # Extend bounds with geometries
            for feature in features
                bounds.extend(feature.geometry.getBounds())

            @extent = bounds

            if not @active_edit_layer
                if  @geometry_type in [ 
                    'OpenLayers.Geometry.Point'
                    'OpenLayers.Geometry.MultiPoint'
                ]
                    @active_edit_layer = @points
                else if @geometry_type in [
                    'OpenLayers.Geometry.LineString'
                    'OpenLayers.Geometry.MultiLineString'
                ]
                    @active_edit_layer = @lines
                else if @geometry_type in [
                    'OpenLayers.Geometry.Polygon'
                    'OpenLayers.Geometry.MultiPolygon'
                ]
                    @active_edit_layer = @polygons
                else
                    alert('geometry type wordt niet ondersteund')
                    return false

            @active_edit_layer.addFeatures(features);

    constructor: (config) ->
        @initConfig(config)
        @callParent(arguments)

    initComponent: () ->
        me = @

        @height = @height ||  (window.innerHeight - 200)
        @width = @width || 500

        @points = new OpenLayers.Layer.Vector("Editable points");
        @lines = new OpenLayers.Layer.Vector("Editable lines");
        @polygons = new OpenLayers.Layer.Vector("Editable polygons");
        @active_editable_layer = null
        @active_editor = null
        @active_edit_layer = null

        vlayer = new OpenLayers.Layer.OSM()

        if @start_geometry
            @deserialize(@start_geometry)

        layers = [vlayer, @points, @lines, @polygons]
        map_controls = [
            new OpenLayers.Control.LayerSwitcher()
        ]

        items = []


        if @mapeditor and @force_type_selection
            controls = {
                point: new OpenLayers.Control.DrawFeature(@points, OpenLayers.Handler.Point),
                line: new OpenLayers.Control.DrawFeature(@lines, OpenLayers.Handler.Path),
                polygon: new OpenLayers.Control.DrawFeature(@polygons, OpenLayers.Handler.Polygon),
                modify_point: new OpenLayers.Control.ModifyFeature(@points)
                modify_line: new OpenLayers.Control.ModifyFeature(@lines)
                modify_polygon: new OpenLayers.Control.ModifyFeature(@polygons)

            }

            Ext.Object.each(controls, (key, control) ->
               map_controls.push(control)
            )


            toggleControl = (form) ->
                values = form.getValues()
                editor = null
                if values.geometry == 'point'
                    me.active_edit_layer = me.points
                else if values.geometry == 'line'
                    me.active_edit_layer = me.lines
                else if values.geometry == 'polygon'
                    me.active_edit_layer = me.polygons

                if values.edit_action == 'modify'
                    if values.geometry == 'point'
                        editor = 'modify_point'
                    else if values.geometry == 'line'
                        editor = 'modify_line'
                    else if values.geometry == 'polygon'
                        editor = 'modify_polygon'

                else if values.edit_action == 'draw'
                    if values.geometry == 'point'
                        editor = 'point'
                    else if values.geometry == 'line'
                        editor = 'line'
                    else if values.geometry == 'polygon'
                        editor = 'polygon'
                else
                    editor = 'drag'

                Ext.Object.each(controls, (key, control) ->

                    if editor == key
                        control.activate()
                        me.active_editor = control
                        return null
                    else
                        control.deactivate()
                        return null
                )

            tbar = [{
                xtype: 'button',
                text: 'Verwijder',
                handler: () ->
                    if me.active_editor.feature
                        feature =  me.active_editor.feature
                        me.active_editor.unselectFeature(feature)
                        me.active_editor.layer.destroyFeatures([feature])
#            {
#                xtype: 'button',
#                text: 'Cancel toevoegen',
#                handler: () ->
#                    if me.active_editor.cancel
#                        me.active_editor.cancel()
#            }
#           {
#               xtype: 'button',
#               text: 'Undo',
#               handler: () ->
#                   if me.active_editor.undo
#                       me.active_editor.undo()
#           }
            }]

        if not @extent
            @extent = new OpenLayers.Bounds(
                Lizard.CM.getContext().init_zoom[0],
                Lizard.CM.getContext().init_zoom[1],
                Lizard.CM.getContext().init_zoom[2],
                Lizard.CM.getContext().init_zoom[3]
            )


        map = Ext.create(GeoExt.panel.Map,{
            flex:1,
            initZoomOnRender: true,
            controls: map_controls
            layers: layers
            extent: @extent
        })

        controls.drag = map.navigation

        items.push(map)

        if @mapeditor and @force_type_selection
            type_selection = []

            if @edit_point
                type_selection.push({ boxLabel: 'point', name: 'geometry', inputValue: 'point', checked: true})
            if @edit_line
                type_selection.push({ boxLabel: 'line', name: 'geometry', inputValue: 'line'})
            if @edit_polygon
                type_selection.push({ boxLabel: 'polygon', name: 'geometry', inputValue: 'polygon'})

            items.push({
                frame: true
                xtype: 'form'
                bodyStyle: 'padding:5px 5px 0',
                fieldDefaults:
                    msgTarget: 'side',
                    labelWidth: 90
                defaults:
                    anchor: '100%'
                items:[{

                    xtype: 'radiogroup',
                    name: 'geometry_type_selection',
                    fieldLabel: 'Geometrie type (max 1 mogelijk)',
                    columns: 3,
                    vertical: false,
                    items: type_selection
                    listeners:
                        change: (field, new_value, old_value, optional) ->
                            if typeof(new_value.geometry) == 'string'
                                form = field.up('form').getForm()
                                toggleControl(form)
                        render: (field) ->
                            # Set the correct drawing mode in the form
                            if me.active_edit_layer == me.points
                                field.setValue geometry: 'point'
                            else if me.active_edit_layer == me.lines
                                field.setValue geometry: 'line'
                            else if me.active_edit_layer == me.polygons
                                field.setValue geometry: 'polygon'
                            
                }
                {
                    xtype: 'radiogroup',
                    name: 'geom_edit_action',
                    fieldLabel: 'Actie',
                    columns: 3,
                    vertical: false,
                    items: [
                        {boxLabel: 'navigeer', name: 'edit_action', inputValue: 'drag', checked: true},
                        {boxLabel: 'teken', name: 'edit_action', inputValue: 'draw'},
                        {boxLabel: 'aanpassen', name: 'edit_action', inputValue: 'modify'},
                    ]
                    listeners:
                        change: (field, new_value, old_value, optional) ->
                            if typeof(new_value.edit_action) == 'string'
                                form = field.up('form').getForm()
                                toggleControl(form)

                }]
            })

        items.push()



        config = {
            items: items
        }
        if tbar
            config.tbar = tbar

        config.bbar = {
            xtype: 'button',
            text: 'Klaar met bewerken',
            handler: (button) ->
                if me.active_edit_layer and
                   me.active_edit_layer.features.length > 0
                    for k, v of controls
                        v.deactivate()  # Prevent projection problem.
                    wkt = me.serialize(me.active_edit_layer.features)
                else
                    wkt = ''
                if me.callback
                    me.callback(wkt)
                this_window = button.up('window')
                this_window.close()
        }


        Ext.apply(@, config)

        @callParent(arguments)



)

