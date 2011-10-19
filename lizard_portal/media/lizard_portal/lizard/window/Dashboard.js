(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Ext.define('Lizard.window.Dashboard', {
    extend: 'Ext.container.Viewport',
    uses: ['Lizard.portlet.Portlet', 'Lizard.portlet.PortalPanel', 'Lizard.portlet.PortalColumn', 'Lizard.portlet.GridPortlet', 'Lizard.portlet.ChartPortlet', 'GeoExt.MapPanel', 'Ext.Img', 'Ext.grid.*', 'Ext.data.Model', 'Ext.data.*', 'Ext.tree.*', 'Ext.button.*', 'Lizard.ux.CheckColumn', 'Ext.MessageBox'],
    config: {
      special: true
    },
    getStore: function() {
      return Ext.create('Ext.data.TreeStore', {
        proxy: {
          type: 'ajax',
          url: '/portal/example_treedata.json',
          extraParams: {
            isJSON: true
          },
          reader: {
            type: 'json'
          }
        },
        root: {
          expanded: true,
          children: [
            {
              id: 1,
              text: "Tekst A",
              leaf: true
            }, {
              id: 2,
              text: "Tekst B",
              expanded: true,
              children: [
                {
                  id: 3,
                  text: "tekst 2",
                  leaf: true
                }, {
                  id: 4,
                  text: "tekst 3",
                  leaf: true
                }, {
                  id: 5,
                  text: "tekst 4",
                  leaf: false
                }
              ]
            }
          ]
        }
      });
    },
    loadPortal: function(params) {
      var container;
      console.log(params);
      console.log("portalTemplate:" + params.portalTemplate);
      container = Ext.getCmp('app-portal');
      container.setLoading(true);
      container.removeAll(true);
      return Ext.Ajax.request({
        url: '/portal/configuration/',
        params: params,
        method: 'GET',
        success: __bind(function(xhr) {
          var navigation, newComponent;
          newComponent = eval('eval( ' + xhr.responseText + ')');
          navigation = Ext.getCmp('areaNavigation');
          navigation.collapse();
          container.add(newComponent);
          return container.setLoading(false);
        }, this),
        failure: __bind(function() {
          Ext.Msg.alert("portal creation failed", "Server communication failure");
          return container.setLoading(false);
        }, this)
      });
    },
    linkTo: function(options, save_state) {
      if (save_state == null) {
        save_state = true;
      }
      console.log(options);
      this.lizard_context = Ext.Object.merge(this.lizard_context, options);
      if (save_state) {
        window.history.pushState(this.lizard_context, "" + options, "/portal/" + this.lizard_context.portalTemplate + "/" + this.lizard_context.area);
      }
      return this.loadPortal(this.lizard_context);
    },
    initComponent: function(arguments) {
      var content;
      content = '<div class="portlet-content">hier moet iets komen</div>';
      Ext.apply(this, {
        id: 'portalWindow',
        lizard_context: {
          period_start: '2000-01-01T00:00',
          period_end: '2002-01-01T00:00',
          area: null,
          portalTemplate: 'homepage',
          activeOrganisation: [1, 2]
        },
        layout: {
          type: 'border',
          padding: 5
        },
        defaults: {
          collapsible: true,
          floatable: true,
          split: true,
          frame: true
        },
        items: [
          {
            region: 'north',
            collapsible: false,
            floatable: false,
            split: false,
            frame: false,
            border: false,
            items: {
              id: 'header'
            },
            height: 60
          }, {
            region: 'west',
            id: 'areaNavigation',
            animCollapse: 500,
            xtype: 'treepanel',
            title: 'Navigatie',
            frame: false,
            width: 250,
            autoScroll: true,
            listeners: {
              itemclick: {
                fn: __bind(function(tree, node) {
                  return this.linkTo({
                    area: node.data.id
                  });
                }, this)
              }
            },
            store: this.getStore(),
            bbar: [
              {
                text: 'Selecteer op kaart -->',
                border: 1,
                handler: function() {
                  return alert('Laat nu kaart zien');
                }
              }
            ]
          }, {
            region: 'center',
            collapsible: false,
            floatable: false,
            split: false,
            id: 'app-portal'
          }
        ]
      });
      Lizard.window.Dashboard.superclass.initComponent.apply(this, arguments);
      return this;
    },
    afterRender: function() {
      var header;
      Lizard.window.Dashboard.superclass.afterRender.apply(this, arguments);
      Ext.Ajax.request({
        url: '/ui/examples/',
        success: function(response, opts) {
          var obj;
          obj = Ext.decode(response.responseText);
          console.log("------------>");
          return console.log(obj);
        },
        failure: function(response, opts) {
          return console.log("Server-side failure with status code " + response.status);
        }
      });
      header = Ext.get('header');
      console.log(header);
      return Ext.get('test').replace(header);
    },
    onPortletClose: function(portlet) {
      return this.showMsg(this.portlet.title + " was removed");
    },
    showMsg: function(msg) {
      var el, msgId;
      el = Ext.get('app-msg');
      msgId = Ext.id();
      this.msgId = msgId;
      el.update(msg).show();
      return Ext.defer(this.clearMsg, 3000, this, [msgId]);
    },
    clearMsg: function(msgId) {
      if (msgId === this.msgId) {
        return Ext.get('app-msg').hide();
      }
    },
    getTools: function() {
      return [
        {
          xtype: 'tool',
          type: 'gear',
          handler: function(e, target, panelHeader, tool) {
            var portlet;
            portlet = panelHeader.ownerCt;
            portlet.setLoading('Working...');
            return Ext.defer((function() {
              return portlet.setLoading(false);
            }), 2000);
          }
        }
      ];
    }
  });
}).call(this);
