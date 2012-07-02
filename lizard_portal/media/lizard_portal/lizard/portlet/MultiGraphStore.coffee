

Ext.define('Lizard.portlet.MultiGraphStore', {
    extend: 'Lizard.portlet.Portlet',

    alias: 'widget.multigraphstore'
    config:
        default_graph_service_url: ''
        store: null
        useGraphButtonBar: true
        fitInPortal: true
        tools: []

    plugins: [
        'applycontext'
    ],

    bodyStyle:
        'padding-right': '20px'

    applyParams: (params) ->
        @updateGraphs(null, params)


    itemSelector: 'div.thumb-wrap',
    emptyText: 'No graphs available',

    getGraphButtonConfig: () ->
        me = @
        button_config = ['grafieken: ']
        for graph in @store.data.items
            #todo change button according to store
            graph_button_settings = {
                text: graph.get('name'),
                pressed: graph.get('visible'),
                enableToggle: true,
                iconCls: 'l-icon-chartbar',
                graph: graph,
                handler: (button) ->
                    button.graph.beginEdit()
                    # button.pressed for visible buttons
                    # button.activated/checked for buttons in pull down
                    # stupid extjs thing to have different properties
                    if button.pressed or (button.activated and button.checked)
                        button.graph.set('visible', true)
                    else
                        button.graph.set('visible', false)

                    me.calcHeights()
                    button.graph.endEdit()
            }

            if graph.get('has_reset_period') or graph.get('has_cumulative_period') or graph.get('add_download_link')
                graph_button_settings.xtype = 'splitbutton'

                menu = []
                if graph.get('has_cumulative_period')
                    period = graph.get('cumulative_period')

                    setCumulativePeriod = (button, select) ->
                        if  select
                            button.graph.set('cumulative_period', button.value)

                    menu.push([
                        '<b class="menu-title">Aggregatie periode</b>',
                        {
                            text: 'Dag',
                            checked: period == 'day',
                            value: 'day'
                            graph: graph
                            group: graph.id+'cumu',
                            checkHandler: setCumulativePeriod
                        },
                        {
                            text: 'Maand',
                            checked: period == 'month',
                            value: 'month'
                            graph: graph
                            group: graph.id+'cumu',
                            checkHandler:  setCumulativePeriod
                        }, {
                            text: 'Kwartaal',
                            checked: period == 'quarter',
                            value: 'quarter'
                            graph: graph
                            group: graph.id+'cumu',
                            checkHandler:  setCumulativePeriod
                        }, {
                            text: 'Jaar',
                            checked: period == 'year',
                            value: 'year'
                            graph: graph
                            group: graph.id+'cumu',
                            checkHandler:  setCumulativePeriod
                        }
                    ])

                if graph.get('has_reset_period') and graph.get('has_cumulative_period')
                    menu.push('-')

                if graph.get('has_reset_period')
                    period = graph.get('reset_period')

                    setResetPeriod = (button, select) ->
                        if  select
                            button.graph.set('reset_period', button.value)

                    menu.push([
                        '<b class="menu-title">Cumulatieve periode</b>',
                        {
                            text: 'Maand',
                            checked: period == 'month',
                            value: 'month'
                            graph:graph
                            group: graph.id+'reset',
                            checkHandler: setResetPeriod
                        }, {
                            text: 'Kwartaal',
                            checked: period == 'quarter',
                            value: 'quarter'
                            graph:graph
                            group: graph.id+'reset',
                            checkHandler: setResetPeriod
                        }, {
                            text: 'Jaar',
                            checked: period == 'year',
                            value: 'year'
                            graph:graph
                            group: graph.id+'reset',
                            checkHandler: setResetPeriod
                        }
                    ])
                if graph.get('add_download_link')
                    menu.push([
                        '-',
                        {
                            text: 'Export',
                            value: 'year'
                            graph:graph
                            handler: (button) ->
                                window.open(Lizard.model.Graph.getDownloadUrl(button.graph.data))
                        }
                    ])

                graph_button_settings.menu = menu

            button_config.push(graph_button_settings)
        return button_config


    calcHeights: (new_width=null, new_height= null, new_fit=null) ->
        size = @body.getSize()
        width = new_width || @body.getSize().width
        height = new_height || @body.getSize().height

        orig_height_visible_graphs = 0

        if new_fit == null
            if typeof(@getFitInPortal()) == 'undefined'
                fit = @config.fitInPortal
            else
                fit = @getFitInPortal()
        else
            fit = new_fit

        if fit
            for graph in @store.data.items
                orig_height_visible_graphs
                if graph.get('visible')
                    orig_height_visible_graphs += graph.get('orig_height') || 300
                    orig_height_visible_graphs += 12 #title

            if orig_height_visible_graphs == 0
                orig_height_visible_graphs = 1

            scale_factor = height/orig_height_visible_graphs
        else
            scale_factor = 1



        for graph in @store.data.items
            orig_height_visible_graphs
            if graph.get('visible')
                graph.beginEdit()
                graph.set('height', graph.get('orig_height') * scale_factor - 12)
                graph.set('width', width - 20)
                graph.endEdit()


    applyFitInPortal: (value, something) ->
        #console.log(arguments)
        if @body
            @calcHeights(null, null, value)
        return value


    updateGraphs: (changes, new_context, context_manager, me) ->
        #console.log('update graphs')

        #console.log(arguments)
        @store.applyContext(changes, new_context)

    open_graph_window: (graph_id) ->
        record = @store.data.map[graph_id]
        graph_url = Lizard.model.Graph.getGraphUrl(record.data, true)

        querystring = Ext.Object.toQueryString({
            title: record.data.name,
            graph_url: graph_url
        })

        url = Ext.String.urlAppend("/graph/window/", querystring)

        return url

    initGraphs: () ->
        me = @

    constructor: (config) ->
        #console.log(config)
        @initConfig(arguments)
        @callParent(arguments)

    initComponent: () ->
        me = @
        buttonBarConfig = null

        if @useGraphButtonBar
            buttonBarConfig = @getGraphButtonConfig()

        # Sometimes there are two pluses, different items on different
        # screens are somehow identified as the same object.
        resizer_index = undefined
        for tool in me.tools
            if tool.name == 'resize-graph'
                resizer_index = me.tools.indexOf(tool)
        resizer_tool = {
            type: 'zoom-in'
            tooltip: 'Zoomen'
            name: 'resize-graph'
            handler: (e, target, panelHeader, tool) ->
                portlet = panelHeader.ownerCt;

                if (tool.type == 'zoom-in')
                    tool.setType('zoom-out')
                    me.setFitInPortal(false)
                else
                    tool.setType('zoom-in')
                    me.setFitInPortal(true)
        }
        if resizer_index == undefined
            me.tools.push(resizer_tool)
        else
            me.tools[resizer_index] = resizer_tool

        Ext.apply(@, {
            layout:
                type: 'vboxscroll'
                align: 'stretch'
            autoScroll:true

            # tbar: buttonBarConfig
            dockedItems: [{
                xtype: 'toolbar'
                dock: 'top'
                # autoScroll: true  # doesn't work
                enableOverflow: true  # works, but click on item doesn't work yet
                items: buttonBarConfig
            }]

            items: {
                xtype: 'dataview',
                store: @store,
                tpl: new Ext.XTemplate(
                    # Stuff that didn't make it in the template
                    # <br/><span>{caption}</span>
                    """
                    <tpl if="this.context_ready()">
                    <tpl for=".">
                      <div class="thumb-wrap">
                        <tpl if="visible">
                          {name}:
                          <tpl if="detail_link">
                            <a href="javascript:void(0)"
                               onclick="javascript:Lizard.CM.setContext({
                                 portal_template:'{detail_link}'
                               })">details</a>&nbsp;
                          </tpl>
                          <a href="{[this.get_link_for_graph_window(values)]}"
                             target="_blank">groot</a>
                          <img src="{[this.get_url(values)]}"
                               height={height} 
                               width={width}
                               class="loading" />
                        </tpl>
                      </div>
                    </tpl>
                    </tpl>
                    """,
                    {
                        get_url:(values) ->
                            if values.width > 0 and values.height >0 and values.dt_start and values.dt_end
                                return Lizard.model.Graph.getGraphUrl(values)
                            else
                                return 'data:image/gif'
                        get_link_for_graph_window: (values) ->
                            return me.open_graph_window(values.id)

                        context_ready:() ->
                            return me.store.context_ready
                    }
                ),
                itemSelector: @itemSelector,
                emptyText: @emptyText
                #beforeComponentLayout: (adjWidth, adjHeight) ->
                #    me.calcHeights(adjWidth, adjHeight)
            }
            listeners: {
                resize: () ->
                    me.calcHeights()
            }


        })

        @store.on('load', (store, records, successful) ->
            #me.store.context_ready = false

            me.calcHeights()
            params = Lizard.CM.getContext()
            if params
                me.store.applyContext(null, params)

            #me.store.context_ready = true
            if me.useGraphButtonBar
                toolbar = me.down('toolbar')
                toolbar.removeAll()
                toolbar.add(me.getGraphButtonConfig())

                me.forceComponentLayout()
        )


        @callParent(arguments)
})
#http://127.0.0.1:8000/graph/?graph=np-ratio&dt_start=2005-03-05%2018:00:00&dt_end=2011-04-01%2000:00:00&width=900&height=300&location=PGMO
