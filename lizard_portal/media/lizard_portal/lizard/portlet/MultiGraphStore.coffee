

Ext.define('Lizard.portlet.MultiGraphStore', {
    extend: 'Lizard.portlet.Portlet',

    alias: 'widget.multigraphstore'
    config:
        default_graph_service_url: ''
        store: null
        useGraphButtonBar: true
        fitInPortal: true

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
                    if button.pressed
                        button.graph.set('visible', true)
                    else
                        button.graph.set('visible', false)

                    me.calcHeights()
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
                        '<b class="menu-title">Cumulatieve periode</b>',
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
                        '<b class="menu-title">Reset periode</b>',
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
                graph.set('height', graph.get('orig_height') * scale_factor - 12)
                graph.set('width', width - 20)


    applyFitInPortal: (value, something) ->
        console.log(arguments)
        if @body
            @calcHeights(null, null, value)
        return value


    updateGraphs: (changes, new_context, context_manager, me) ->
        console.log('update graphs')

        console.log(arguments)
        @store.applyContext(changes, new_context)

    initGraphs: () ->
        me = @

    constructor: (config) ->
        console.log(config)
        @initConfig(arguments)
        @callParent(arguments)

    initComponent: () ->
        me = @
        buttonBarConfig = null

        if @useGraphButtonBar
            buttonBarConfig = @getGraphButtonConfig()


        Ext.apply(@, {
            layout:
                type: 'vboxscroll'
                align: 'stretch'


            autoScroll:true
            tbar: buttonBarConfig
            items: {
                xtype: 'dataview',
                store: @store,
                tpl: new Ext.XTemplate(
                    '<tpl if="this.context_ready()">',
                    '<tpl for=".">',
                        '<div class="thumb-wrap">',
                            '<tpl if="visible">',
                                '{name}:   ',
                                    '<tpl if="detail_link">',
                                         '<a href="javascript:Ext.getCmp(\'portalWindow\').linkTo({portalTemplate:\'{detail_link}\'})">details</a>',
                                    '</tpl>',
                                '<img src="',
                                '{[this.get_url(values)]}',
                                '" height={height} width={width} />',
                                #'<br/><span>{caption}</span>',
                            '</tpl>',
                        '</div>',
                    '</tpl>',
                    '</tpl>',
                    {
                        get_url:(values) ->
                           return Lizard.model.Graph.getGraphUrl(values)
                        context_ready:() ->
                           return me.store.context_ready
                    }
                ),
                itemSelector: @itemSelector,
                emptyText: @emptyText
                #beforeComponentLayout: (adjWidth, adjHeight) ->
                #    me.calcHeights(adjWidth, adjHeight)
            }
            tools: [{
                type: 'plus'
                handler: (e, target, panelHeader, tool) ->
                    portlet = panelHeader.ownerCt;

                    if (tool.type == 'plus')
                        tool.setType('minus')
                        me.setFitInPortal(false)
                    else
                        tool.setType('plus')
                        me.setFitInPortal(true)
            }],
            listeners: {
                resize: () ->
                    me.calcHeights()
            }


        })


        @callParent(arguments)
})
#http://127.0.0.1:8000/graph/?graph=np-ratio&dt_start=2005-03-05%2018:00:00&dt_end=2011-04-01%2000:00:00&width=900&height=300&location=PGMO