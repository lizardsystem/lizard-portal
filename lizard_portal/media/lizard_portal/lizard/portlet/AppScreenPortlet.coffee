Ext.define('Lizard.portlet.AppScreenPortlet', {
    extend: 'Lizard.portlet.Portlet'
    alias: 'widget.appscreenportlet'
    config:
        graph_service_url: ''
        graphs: []
        context_manager: []

    # setGraphFit: (fit) ->
    #     items = @graphs
    #     if fit
    #         for item in items
    #             item.flex = 1
    #     else
    #         for item in items
    #             delete item.flex

    #     @doLayout()


    # updateGraphs: (changes, new_context, context_manager, me) ->
    #     console.log('update graphs')

    #     for graph in me.graphs
    #         console.log(arguments)
    #         graph.applyParams({
    #             dt_start: Ext.Date.format(new_context.period_start,'Y-m-d H:i:s'),
    #             dt_end: Ext.Date.format(new_context.period_end,'Y-m-d H:i:s'),
    #             location: new_context.object_id
    #         })


    # initGraphs: () ->
    #     me = @
    #     getImageConfig = (graph) -> #dit moet anders
    #         output = graph
    #         output.hidden = graph.hidden || false
    #         output.orig_src = graph.graph_service_url || me.graph_service_url
    #         output.params = graph.params || {}
    #         return output

    #     graph_configs = @getGraphs()
    #     context = Ext.getCmp('portalWindow').context_manager.getContext()
    #     @graphs = []


    #     for graph_config in graph_configs
    #         graph = Ext.create('Lizard.ux.ImageResize', Ext.merge({
    #             params:
    #                 dt_start: Ext.Date.format(context.period_start,'Y-m-d H:i:s'),
    #                 dt_end: Ext.Date.format(context.period_end,'Y-m-d H:i:s'),
    #                 location: context.object_id
    #         },getImageConfig(graph_config)))

    #         #graph.applyParams()
    #         #graph.hasResetPeriod
    #         #graph.hasCumulPeriod


    #         @items.push(graph)
    #         @graphs.push(graph)


    #         graph_button_settings = {
    #             text: graph_config.title,
    #             pressed: not graph_config.hidden,
    #             enableToggle: true,
    #             iconCls: 'l-icon-chartbar',
    #             graph: graph,
    #             handler: (button) ->
    #                 if button.pressed
    #                     button.graph.show()
    #                 else
    #                     button.graph.hide()
    #         }

    #         onItemCheck = () ->
    #             console.log('klik')



    #         graph_button_settings.xtype = 'splitbutton'
    #         graph_button_settings.menu = 	[
    #             '<b class="menu-title">Cumulatieve periode</b>',
    #             {
    #                 text: 'Dag',
    #                 checked: false,
    #                 group: graph_config.title+'cumu',
    #                 checkHandler: onItemCheck
    #             },
    #             {
    #                 text: 'Maand',
    #                 checked: true,
    #                 group: graph_config.title+'cumu',
    #                 checkHandler: onItemCheck
    #             }, {
    #                 text: 'Kwartaal',
    #                 checked: false,
    #                 group: graph_config.title+'cumu',
    #                 checkHandler: onItemCheck
    #             }, {
    #                 text: 'Jaar',
    #                 checked: false,
    #                 group: graph_config.title+'cumu',
    #                 checkHandler: onItemCheck
    #             }
    #             '-',
    #             '<b class="menu-title">Reset periode</b>',
    #             {
    #                 text: 'Maand',
    #                 checked: true,
    #                 group: graph_config.title+'reset',
    #                 checkHandler: onItemCheck
    #             }, {
    #                 text: 'Kwartaal',
    #                 checked: false,
    #                 group: graph_config.title+'reset',
    #                 checkHandler: onItemCheck
    #             }, {
    #                 text: 'Jaar',
    #                 checked: false,
    #                 group: graph_config.title+'reset',
    #                 checkHandler: onItemCheck
    #             }
    #         ]

    #         @tbar.push(graph_button_settings)
    # constructor: (config) ->
    #     console.log(config)
    #     @initConfig(arguments)
    #     @callParent(arguments)

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
            tbar: ['Apps:']
            items: []
            tools: [{
                type: 'plus'
                handler: (e, target, panelHeader, tool) ->
                    portlet = panelHeader.ownerCt;

                    if (tool.type == 'plus')
                        tool.setType('minus')
                        me.setGraphFit(false)
                    else
                        tool.setType('plus')
                        me.setGraphFit(true)
            }]
        })
        console.log 'cm'
        console.log @context_manager
        # if @context_manager
        #     console.log('register contextchange')
        #     @context_manager.on('contextchange', (change, context, context_m) ->
        #         me.updateGraphs(change, context, context_m, me)
        #     )

        # @initGraphs()
        @callParent(arguments)
})

