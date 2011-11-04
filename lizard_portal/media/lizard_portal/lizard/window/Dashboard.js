(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Ext.define('Lizard.window.Dashboard', {
    extend: 'Ext.container.Viewport',
    config: {
      area_selection_template: 'aan_afvoergebied_selectie',
      area_store: 'Vss.store.CatchmentTree',
      lizard_context: {
        period_start: '2000-01-01T00:00',
        period_end: '2002-01-01T00:00',
        object: 'aan_afvoergebied',
        object_id: null,
        portalTemplate: 'homepage',
        base_url: 'portal/watersysteem'
      }
    },
    linkTo: function(options, save_state) {
      if (save_state == null) {
        save_state = true;
      }
      this.setContext(options, save_state);
      return this.loadPortal(this.lizard_context);
    },
    setContext: function(options, save_state) {
      if (save_state == null) {
        save_state = true;
      }
      this.setLizard_context(Ext.merge(this.getLizard_context(), options));
      if (save_state) {
        try {
          return window.history.pushState(this.lizard_context, "" + options, "/" + this.lizard_context.base_url + "/#" + this.lizard_context.portalTemplate + "/" + this.lizard_context.object + "/" + this.lizard_context.object_id);
        } catch (error) {
          return console.log("not able to set pushState");
        }
      }
    },
    loadPortal: function(params, area_selection_collapse) {
      var container, tab;
      if (area_selection_collapse == null) {
        area_selection_collapse = true;
      }
      console.log("portalTemplate:" + params.portalTemplate);
      console.log(params);
      container = Ext.getCmp('app-portal');
      tab = container.child("#" + params.portalTemplate);
      if (tab) {
        container.setActiveTab(tab);
        return tab.setContext(params);
      } else {
        container.setLoading(true);
        return Ext.Ajax.request({
          url: '/portal/configuration/',
          params: params,
          method: 'GET',
          success: __bind(function(xhr) {
            var navigation, newComponent;
            newComponent = eval('eval( ' + xhr.responseText + ')');
            if (area_selection_collapse) {
              navigation = Ext.getCmp('areaNavigation');
              navigation.collapse();
            }
            tab = container.add(newComponent);
            container.setActiveTab(tab);
            return container.setLoading(false);
          }, this),
          failure: __bind(function() {
            Ext.Msg.alert("portal creation failed", "Server communication failure");
            return container.setLoading(false);
          }, this)
        });
      }
    },
    showAreaSelection: function() {
      arguments = Ext.Object.merge({}, this.lizard_context, {
        portalTemplate: this.area_selection_template
      });
      return this.loadPortal(arguments, false);
    },
    constructor: function(config) {
      this.initConfig(config);
      return Lizard.window.Dashboard.superclass.constructor.apply(this);
    },
    initComponent: function(arguments) {
      var me;
      me = this;
      Ext.apply(this, {
        id: 'portalWindow',
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
              id: 'header',
              height: 60,
              html: ""
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
                    object_id: node.data.id
                  });
                }, this)
              }
            },
            store: me.area_store,
            bbar: [
              {
                text: 'Selecteer op kaart -->',
                border: 1,
                handler: function() {
                  return Ext.getCmp('portalWindow').showAreaSelection();
                }
              }
            ]
          }, {
            region: 'center',
            collapsible: false,
            floatable: false,
            split: false,
            xtype: 'tabpanel',
            id: 'app-portal'
          }
        ]
      });
      Lizard.window.Dashboard.superclass.initComponent.apply(this, arguments);
      return this;
    },
    afterRender: function() {
      var hash, parts;
      Lizard.window.Dashboard.superclass.afterRender.apply(this, arguments);
      Ext.get('header').load({
        url: '/portal/portalheader/',
        scripts: true
      });
      if (window.location.hash) {
        hash = window.location.hash;
        parts = hash.replace('#', '').split('/');
        Ext.getCmp('portalWindow').linkTo({
          portalTemplate: parts[0],
          object: parts[1],
          object_id: parts[2]
        }, false);
      }
      if (this.getLizard_context().object_id === null) {
        return this.showAreaSelection();
      }
    }
  });
}).call(this);
