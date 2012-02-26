(function() {
  Ext.define('Lizard.portlet.MultiGraphStore', {
    extend: 'Lizard.portlet.Portlet',
    alias: 'widget.multigraphstore',
    config: {
      default_graph_service_url: '',
      store: null,
      useGraphButtonBar: true,
      fitInPortal: true,
      tools: []
    },
    plugins: ['applycontext'],
    bodyStyle: {
      'padding-right': '20px'
    },
    applyParams: function(params) {
      return this.updateGraphs(null, params);
    },
    itemSelector: 'div.thumb-wrap',
    emptyText: 'No graphs available',
    getGraphButtonConfig: function() {
      var button_config, graph, graph_button_settings, me, menu, period, setCumulativePeriod, setResetPeriod, _i, _len, _ref;
      me = this;
      button_config = ['grafieken: '];
      _ref = this.store.data.items;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        graph = _ref[_i];
        graph_button_settings = {
          text: graph.get('name'),
          pressed: graph.get('visible'),
          enableToggle: true,
          iconCls: 'l-icon-chartbar',
          graph: graph,
          handler: function(button) {
            button.graph.beginEdit();
            if (button.pressed) {
              button.graph.set('visible', true);
            } else {
              button.graph.set('visible', false);
            }
            me.calcHeights();
            return button.graph.endEdit();
          }
        };
        if (graph.get('has_reset_period') || graph.get('has_cumulative_period') || graph.get('add_download_link')) {
          graph_button_settings.xtype = 'splitbutton';
          menu = [];
          if (graph.get('has_cumulative_period')) {
            period = graph.get('cumulative_period');
            setCumulativePeriod = function(button, select) {
              if (select) {
                return button.graph.set('cumulative_period', button.value);
              }
            };
            menu.push([
              '<b class="menu-title">Cumulatieve periode</b>', {
                text: 'Dag',
                checked: period === 'day',
                value: 'day',
                graph: graph,
                group: graph.id + 'cumu',
                checkHandler: setCumulativePeriod
              }, {
                text: 'Maand',
                checked: period === 'month',
                value: 'month',
                graph: graph,
                group: graph.id + 'cumu',
                checkHandler: setCumulativePeriod
              }, {
                text: 'Kwartaal',
                checked: period === 'quarter',
                value: 'quarter',
                graph: graph,
                group: graph.id + 'cumu',
                checkHandler: setCumulativePeriod
              }, {
                text: 'Jaar',
                checked: period === 'year',
                value: 'year',
                graph: graph,
                group: graph.id + 'cumu',
                checkHandler: setCumulativePeriod
              }
            ]);
          }
          if (graph.get('has_reset_period') && graph.get('has_cumulative_period')) {
            menu.push('-');
          }
          if (graph.get('has_reset_period')) {
            period = graph.get('reset_period');
            setResetPeriod = function(button, select) {
              if (select) {
                return button.graph.set('reset_period', button.value);
              }
            };
            menu.push([
              '<b class="menu-title">Reset periode</b>', {
                text: 'Maand',
                checked: period === 'month',
                value: 'month',
                graph: graph,
                group: graph.id + 'reset',
                checkHandler: setResetPeriod
              }, {
                text: 'Kwartaal',
                checked: period === 'quarter',
                value: 'quarter',
                graph: graph,
                group: graph.id + 'reset',
                checkHandler: setResetPeriod
              }, {
                text: 'Jaar',
                checked: period === 'year',
                value: 'year',
                graph: graph,
                group: graph.id + 'reset',
                checkHandler: setResetPeriod
              }
            ]);
          }
          if (graph.get('add_download_link')) {
            menu.push([
              '-', {
                text: 'Export',
                value: 'year',
                graph: graph,
                handler: function(button) {
                  return window.open(Lizard.model.Graph.getDownloadUrl(button.graph.data));
                }
              }
            ]);
          }
          graph_button_settings.menu = menu;
        }
        button_config.push(graph_button_settings);
      }
      return button_config;
    },
    calcHeights: function(new_width, new_height, new_fit) {
      var fit, graph, height, orig_height_visible_graphs, scale_factor, size, width, _i, _j, _len, _len2, _ref, _ref2, _results;
      if (new_width == null) {
        new_width = null;
      }
      if (new_height == null) {
        new_height = null;
      }
      if (new_fit == null) {
        new_fit = null;
      }
      size = this.body.getSize();
      width = new_width || this.body.getSize().width;
      height = new_height || this.body.getSize().height;
      orig_height_visible_graphs = 0;
      if (new_fit === null) {
        if (typeof (this.getFitInPortal()) === 'undefined') {
          fit = this.config.fitInPortal;
        } else {
          fit = this.getFitInPortal();
        }
      } else {
        fit = new_fit;
      }
      if (fit) {
        _ref = this.store.data.items;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          graph = _ref[_i];
          orig_height_visible_graphs;
          if (graph.get('visible')) {
            orig_height_visible_graphs += graph.get('orig_height') || 300;
            orig_height_visible_graphs += 12;
          }
        }
        if (orig_height_visible_graphs === 0) {
          orig_height_visible_graphs = 1;
        }
        scale_factor = height / orig_height_visible_graphs;
      } else {
        scale_factor = 1;
      }
      _ref2 = this.store.data.items;
      _results = [];
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        graph = _ref2[_j];
        orig_height_visible_graphs;
        _results.push(graph.get('visible') ? (graph.beginEdit(), graph.set('height', graph.get('orig_height') * scale_factor - 12), graph.set('width', width - 20), graph.endEdit()) : void 0);
      }
      return _results;
    },
    applyFitInPortal: function(value, something) {
      console.log(arguments);
      if (this.body) {
        this.calcHeights(null, null, value);
      }
      return value;
    },
    updateGraphs: function(changes, new_context, context_manager, me) {
      console.log('update graphs');
      console.log(arguments);
      return this.store.applyContext(changes, new_context);
    },
    initGraphs: function() {
      var me;
      return me = this;
    },
    constructor: function(config) {
      console.log(config);
      this.initConfig(arguments);
      return this.callParent(arguments);
    },
    initComponent: function() {
      var buttonBarConfig, me;
      me = this;
      buttonBarConfig = null;
      if (this.useGraphButtonBar) {
        buttonBarConfig = this.getGraphButtonConfig();
      }
      me.tools.push([
        {
          type: 'plus',
          handler: function(e, target, panelHeader, tool) {
            var portlet;
            portlet = panelHeader.ownerCt;
            if (tool.type === 'plus') {
              tool.setType('minus');
              return me.setFitInPortal(false);
            } else {
              tool.setType('plus');
              return me.setFitInPortal(true);
            }
          }
        }
      ]);
      Ext.apply(this, {
        layout: {
          type: 'vboxscroll',
          align: 'stretch'
        },
        autoScroll: true,
        tbar: buttonBarConfig,
        items: {
          xtype: 'dataview',
          store: this.store,
          tpl: new Ext.XTemplate('<tpl if="this.context_ready()">', '<tpl for=".">', '<div class="thumb-wrap">', '<tpl if="visible">', '{name}:   ', '<tpl if="detail_link">', '<a href="javascript:Lizard.CM.setContext({portal_template:\'{detail_link}\'})">details</a>', '</tpl>', '<img src="', '{[this.get_url(values)]}', '" height={height} width={width} />', '</tpl>', '</div>', '</tpl>', '</tpl>', {
            get_url: function(values) {
              if (values.width > 0 && values.height > 0 && values.dt_start && values.dt_end) {
                return Lizard.model.Graph.getGraphUrl(values);
              } else {
                return 'data:image/gif';
              }
            },
            context_ready: function() {
              return me.store.context_ready;
            }
          }),
          itemSelector: this.itemSelector,
          emptyText: this.emptyText
        },
        listeners: {
          resize: function() {
            return me.calcHeights();
          }
        }
      });
      this.store.on('load', function(store, records, successful) {
        var params, toolbar;
        me.calcHeights();
        params = Lizard.CM.getContext();
        if (params) {
          me.store.applyContext(null, params);
        }
        if (me.useGraphButtonBar) {
          toolbar = me.down('toolbar');
          toolbar.removeAll();
          toolbar.add(me.getGraphButtonConfig());
          return me.forceComponentLayout();
        }
      });
      return this.callParent(arguments);
    }
  });
}).call(this);
