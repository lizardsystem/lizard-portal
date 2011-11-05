

Ext.define('Lizard.portlet.MultiGraph', {
    extend: 'Lizard.portlet.Portlet',
    alias: 'widget.multigraph',
    config: {
        graph_service_url: 'bla',
        adapter_layer_json: {module_id:null,parameter_id:"ALMR110","fews_norm_source_slug":""},
        graphs: [{
            title: 'Belasting',
            timeseries:[{
                parameter_id: "ALMR110",
                module_id: "ImportLE",
                ident: "53R0017"
            }]
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

        for (nr in items) {
            items[nr].doLayout();
        }
    },
    initGraphs: function() {
        var getImageConfig = function (graph) {
            result = {}
            result['orig_src'] = graph['graph_service_url'] || this.graph_service_url;
            result['params'] = {}
            result['params']['adapter_layer_json'] = graph['adapter_layer_json'] || this.graph_module_instance;
            result['params']['ident'] = []
            for (ts in graph.timeseries) {
                result.params.ident.push(graph.timeseries[ts])
            }
            return result
        }

        console.log('setGraphs');
        var graphs = this.getGraphs();
        console.log(graphs)
        for (nr in graphs) {
            var graph_config = graphs[nr];

            var graph = Ext.create('Lizard.ux.ImageResize', getImageConfig(graph_config));

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
            autoScroll:true,
            tbar: [],
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
