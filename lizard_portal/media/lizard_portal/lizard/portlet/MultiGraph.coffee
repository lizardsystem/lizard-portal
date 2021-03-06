

Ext.define('Lizard.portlet.MultiGraph', {
    extend: 'Lizard.portlet.Portlet'
    alias: 'widget.multigraph'
    config:
        graph_service_url: ''
        graphs: []
        context_manager: []

    setGraphFit: (fit) ->
        items = @graphs
        if fit
            for item in items
                item.flex = 1
        else
            for item in items
                delete item.flex

        @doLayout()


    updateGraphs: (changes, changed_objects, new_context,  me) ->
        for graph in me.graphs
            graph.applyParams({
                dt_start: Ext.Date.format(new_context.period.start,'Y-m-d H:i:s'),
                dt_end: Ext.Date.format(new_context.period.end,'Y-m-d H:i:s'),
                location: new_context.object.id
            })


    initGraphs: () ->
        me = @
        getImageConfig = (graph) -> #dit moet anders
            output = graph
            output.hidden = graph.hidden || false
            output.orig_src = graph.graph_service_url || me.graph_service_url
            output.params = graph.params || {}
            return output

        graph_configs = @getGraphs()
        context = Ext.getCmp('portalWindow').context_manager.getContext()
        @graphs = []


        for graph_config in graph_configs
            graph = Ext.create('Lizard.ux.ImageResize', Ext.merge({
                params:
                    dt_start: Ext.Date.format(context.period.start,'Y-m-d H:i:s'),
                    dt_end: Ext.Date.format(context.period.end,'Y-m-d H:i:s'),
                    location: context.object.id
            },getImageConfig(graph_config)))

            #graph.applyParams()
            #graph.hasResetPeriod
            #graph.hasCumulPeriod

            @items.push(graph)
            @graphs.push(graph)

            graph_button_settings = {
                text: graph_config.title,
                pressed: not graph_config.hidden,
                enableToggle: true,
                iconCls: 'l-icon-chartbar',
                graph: graph,
                handler: (button) ->
                    if button.pressed
                        button.graph.show()
                    else
                        button.graph.hide()
            }

            onItemCheck = () ->
            @tbar.push(graph_button_settings)


    constructor: (config) ->
        @initConfig(arguments)
        @callParent(arguments)

    initComponent: () ->
        me = @

        Ext.apply(@, {
            layout:
                type: 'vboxscroll'
                align: 'stretch'

            defaults:
                flex: 1,
                height: 250

            autoScroll:true
            tbar: ['Grafieken:']
            items: []
            tools: [{
                type: 'zoom-in'
                tooltip: 'Zoomen'
                handler: (e, target, panelHeader, tool) ->
                    portlet = panelHeader.ownerCt;

                    if (tool.type == 'zoom-in')
                        tool.setType('zoom-out')
                        me.setGraphFit(false)
                    else
                        tool.setType('zoom-in')
                        me.setGraphFit(true)
            }]
        })
        if @context_manager
            @context_manager.on('contextchange', (change, context, context_m) ->
                me.updateGraphs(change, context, context_m, me)
            )

        @initGraphs()
        @callParent(arguments)
})
#http://127.0.0.1:8000/graph/?graph=np-ratio&dt_start=2005-03-05%2018:00:00&dt_end=2011-04-01%2000:00:00&width=900&height=300&location=PGMO
