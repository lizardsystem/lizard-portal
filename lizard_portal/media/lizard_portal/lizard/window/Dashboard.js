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
    setBreadCrumb: function(bread_crumbs) {
      var a, bread_div, crumb, el, element, me, _i, _len, _results;
      me = this;
      bread_div = Ext.get('breadcrumbs');
      a = bread_div.down('div');
      while (a) {
        a.remove();
        a = bread_div.down('div');
      }
      a = bread_div.down('a');
      while (a) {
        a.remove();
        a = bread_div.down('a');
      }
      element = {
        tag: 'div',
        cls: 'link',
        html: 'aan-afvoergebied'
      };
      bread_div.createChild(element);
      el = bread_div.last();
      el.addListener('click', function() {
        return me.showAreaSelection();
      });
      if (bread_crumbs) {
        bread_div.createChild({
          tag: 'div',
          html: ' - '
        });
        _results = [];
        for (_i = 0, _len = bread_crumbs.length; _i < _len; _i++) {
          crumb = bread_crumbs[_i];
          _results.push(crumb.link ? (element = {
            tag: 'div',
            cls: 'link',
            html: crumb.name
          }, bread_div.createChild(element), el = bread_div.last(), el.addListener('click', function(evt, obj, crumb_l) {
            return me.linkTo({
              portalTemplate: crumb_l.link
            });
          }, this, crumb), bread_div.createChild({
            tag: 'div',
            html: ' - '
          })) : bread_div.createChild({
            tag: 'div',
            html: crumb.name
          }));
        }
        return _results;
      }
    },
    linkTo: function(options, save_state, area_selection_collapse, skip_animation) {
      if (save_state == null) {
        save_state = true;
      }
      if (area_selection_collapse == null) {
        area_selection_collapse = true;
      }
      if (skip_animation == null) {
        skip_animation = false;
      }
      this.setContext(options, save_state);
      return this.loadPortal(this.lizard_context, area_selection_collapse, skip_animation);
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
    loadPortal: function(params, area_selection_collapse, skip_animation) {
      var container, me, tab;
      if (area_selection_collapse == null) {
        area_selection_collapse = true;
      }
      if (skip_animation == null) {
        skip_animation = false;
      }
      console.log("portalTemplate:" + params.portalTemplate);
      console.log(params);
      me = this;
      container = Ext.getCmp('app-portal');
      tab = container.child("#" + params.portalTemplate);
      if (tab) {
        container.setActiveTab(tab);
        tab.setContext(params);
        console.log('check');
        this.setBreadCrumb(tab.breadcrumbs);
        return console.log('check');
      } else {
        container.setLoading(true);
        console.log('check');
        return Ext.Ajax.request({
          url: '/portal/configuration/',
          params: params,
          method: 'GET',
          success: __bind(function(xhr) {
            var navigation, newComponent;
            newComponent = eval('eval( ' + xhr.responseText + ')');
            console.log('check');
            newComponent.params = Ext.merge({}, newComponent.params, me.getLizard_context());
            if (area_selection_collapse) {
              navigation = Ext.getCmp('areaNavigation');
              navigation.collapse();
            }
            tab = container.add(newComponent);
            container.setActiveTab(tab);
            container.setLoading(false);
            console.log('check');
            me.setBreadCrumb(newComponent.breadcrumbs);
            return console.log('check');
          }, this),
          failure: __bind(function() {
            Ext.Msg.alert("portal creation failed", "Server communication failure");
            return container.setLoading(false);
          }, this)
        });
      }
    },
    showAreaSelection: function() {
      var navigation;
      navigation = Ext.getCmp('areaNavigation');
      navigation.expand();
      arguments = Ext.Object.merge({}, this.lizard_context, {
        portalTemplate: this.area_selection_template
      });
      return this.loadPortal(arguments, false);
    },
    constructor: function(config) {
      this.initConfig(config);
      return this.callParent(arguments);
    },
    initComponent: function(arguments) {
      var me;
      me = this;
      Ext.apply(this, {
        id: 'portalWindow',
        layout: {
          type: 'border'
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
              height: 55,
              html: ""
            }
          }, {
            region: 'west',
            id: 'areaNavigation',
            animCollapse: 500,
            xtype: 'treepanel',
            title: 'Navigatie',
            frame: false,
            width: 250,
            autoScroll: true,
            collapsed: true,
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
                handler: function() {
                  return me.showAreaSelection();
                }
              }
            ]
          }, {
            region: 'center',
            collapsible: false,
            floatable: false,
            tabPosition: 'bottom',
            plain: true,
            split: false,
            xtype: 'tabpanel',
            id: 'app-portal'
          }, {
            region: 'east',
            width: 200,
            title: 'Analyse',
            collapsible: true,
            floatable: false,
            tabPosition: 'bottom',
            collapsed: true,
            plain: true,
            split: true,
            xtype: 'tabpanel',
            id: 'analyse',
            items: [
              {
                title: 'WQ'
              }, {
                title: 'Eco'
              }
            ]
          }
        ]
      });
      this.callParent(arguments);
      return this;
    },
    afterRender: function() {
      var anim_setting, hash, navigation, parts;
      this.callParent(arguments);
      Ext.get('header').load({
        url: '/portalheader/',
        scripts: true
      });
      if (window.location.hash) {
        hash = window.location.hash;
        parts = hash.replace('#', '').split('/');
        Ext.getCmp('portalWindow').linkTo({
          portalTemplate: parts[0],
          object: parts[1],
          object_id: parts[2]
        }, false, true, false);
      }
      if (this.getLizard_context().object_id === null) {
        navigation = Ext.getCmp('areaNavigation');
        anim_setting = navigation.animCollapse;
        navigation.animCollapse = false;
        navigation.expand(false);
        navigation.animCollapse = anim_setting;
        return this.showAreaSelection(false);
      }
    }
  });
}).call(this);
