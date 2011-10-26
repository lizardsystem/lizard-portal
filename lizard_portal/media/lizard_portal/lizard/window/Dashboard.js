(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Ext.define('Lizard.window.Dashboard', {
    extend: 'Ext.container.Viewport',
    config: {
      special: true
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
      console.log(options);
      console.log(this.lizard_context);
      this.lizard_context = Ext.Object.merge(this.lizard_context, options);
      if (save_state) {
        return window.history.pushState(this.lizard_context, "" + options, "/portal/#" + this.lizard_context.portalTemplate + "/" + this.lizard_context.object + "/" + this.lizard_context.object_id);
      }
    },
    loadPortal: function(params, area_selection_collapse) {
      var container;
      if (area_selection_collapse == null) {
        area_selection_collapse = true;
      }
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
          if (area_selection_collapse) {
            navigation = Ext.getCmp('areaNavigation');
            navigation.collapse();
          }
          container.add(newComponent);
          return container.setLoading(false);
        }, this),
        failure: __bind(function() {
          Ext.Msg.alert("portal creation failed", "Server communication failure");
          return container.setLoading(false);
        }, this)
      });
    },
    showAreaSelection: function() {
      arguments = Ext.Object.merge({}, this.lizard_context, {
        portalTemplate: 'aan_afvoergebied_selectie'
      });
      return this.loadPortal(arguments, false);
    },
    initComponent: function(arguments) {
      var content;
      content = '<div class="portlet-content">hier moet iets komen</div>';
      Ext.apply(this, {
        id: 'portalWindow',
        lizard_context: {
          period_start: '2000-01-01T00:00',
          period_end: '2002-01-01T00:00',
          object: 'aan_afvoergebied',
          object_id: null,
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
            store: 'Vss.store.CatchmentTree',
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
            id: 'app-portal'
          }
        ]
      });
      Lizard.window.Dashboard.superclass.initComponent.apply(this, arguments);
      return this;
    },
    afterRender: function() {
      Lizard.window.Dashboard.superclass.afterRender.apply(this, arguments);
      Ext.get('header').load({
        url: '/portal/portalheader/',
        scripts: true
      });
      if (this.lizard_context.object_id === null) {
        return this.showAreaSelection();
      }
    }
  });
}).call(this);
