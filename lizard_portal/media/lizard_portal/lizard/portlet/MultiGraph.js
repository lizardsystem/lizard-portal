

Ext.define('Lizard.portlet.MultiGraph', {
    extend: 'Lizard.portlet.Portlet',
    alias: 'widget.multigraph',
    config: {
        graph_service_url: 'bla',
        graph_module_instance: 'bal bal',
        graphs: [{
            title: 'Belasting'
        }, {
           title: 'Verblijftijd'
        }, {
           title: 'P/N ratio'
        }]
    },
    setGraphFit: function(fit) {
        var items = this.items.items;
        if (fit) {
            for (nr in items) {
                items[nr].flex = 1;
            }
        } else {
            for (nr in items) {
                delete items[nr].flex;
            }
        }
        this.doLayout();
    },
    initGraphs: function() {
        console.log('setGraphs');
        var graphs = this.getGraphs();
        console.log(graphs)
        for (nr in graphs) {
            var graph_config = graphs[nr];

            var graph = Ext.create('Ext.tcontainer.Container', { html: 'grafiek' })

            this.items.push(graph);

            toolbar = this.getDockedItems('toolbar')[0]

            this.tbar.push({
                text: graph_config.title,
                pressed: true,
                enableToggle: true,
                iconCls: 'x-grid-checkheader-checked',
                graph: graph,
                handler: function(button) {
                    if (button.pressed) {
                        button.graph.show();
                    } else {
                        button.graph.hide();
                    }
                }
            })
        }
    },
    constructor: function(config) {
        console.log('init')
        this.initConfig(arguments);
        this.callParent(arguments);
    },
    initComponent: function() {
        var me = this;
        Ext.apply(this,{

            layout: {
                type: 'vboxscroll',
                align: 'stretch'
            },
            defaults: {
                flex: 1,
                height: 250
            },
            tbar: ['|'],
            items: [],
            tools: [{
                type: 'plus',
                handler: function(e, target, panelHeader, tool){
                    var portlet = panelHeader.ownerCt;

                    if (this.type == 'plus') {
                        tool.setType('minus');
                        portlet.setGraphFit(false);
                    } else {
                        tool.setType('plus');
                        portlet.setGraphFit(true);
                    }
                }
            }]
        });
        this.initGraphs();
        this.callParent(arguments);
    }
});
