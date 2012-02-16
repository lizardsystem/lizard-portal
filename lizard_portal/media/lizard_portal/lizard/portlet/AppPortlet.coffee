


Ext.define('Lizard.portlet.AppPortlet', {
    extend: 'Lizard.portlet.Portlet',
    alias: 'widget.appportlet'
    config:
        default_graph_service_url: ''
        store: null
        useGraphButtonBar: true
        fitInPortal: true


    bodyStyle:
        'padding-right': '20px'

    itemSelector: 'div.thumb-wrap',
    emptyText: 'No graphs available',



    constructor: (config) ->
        @initConfig(arguments)
        @callParent(arguments)

    initComponent: () ->
        me = @


        Ext.apply(@, {
            layout:
                type: 'vboxscroll'
                align: 'stretch'


            autoScroll:true
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
            },
            listeners: {
                resize: () ->
                    console.log('test')
            }


        })


        @callParent(arguments)
})
#http://127.0.0.1:8000/graph/?graph=np-ratio&dt_start=2005-03-05%2018:00:00&dt_end=2011-04-01%2000:00:00&width=900&height=300&location=PGMO