
/*
Lizard.window.Screen

Setup for the default viewport of Lizard with a header, (area) navigation on the left and the portals in the center

with the option
showOnlyPortal, only the portal is shown (without the header and left navigation)


The class includes functions to load and activate portals, which are:
linkTo
loadPortal
showNavigationPortalTemplate
*/

(function() {
  var __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Ext.define('Lizard.window.Screen', {
    extend: 'Ext.container.Viewport',
    config: {
      header: {
        src_logo: 'vss/stowa_logo.png',
        url_homepage: '/',
        headertabs: []
      },
      context_manager: null,
      showOnlyPortal: false,
      navigation_tabs: []
    },
    linkTo: function(params, save_state, area_selection_collapse, skip_animation) {
      if (save_state == null) save_state = true;
      if (area_selection_collapse == null) area_selection_collapse = true;
      if (skip_animation == null) skip_animation = false;
      return Lizard.CM.setContext(params, save_state, false);
    },
    linkToNewWindow: function(params, save_state, area_selection_collapse, skip_animation) {
      var args, href;
      if (save_state == null) save_state = true;
      if (area_selection_collapse == null) area_selection_collapse = true;
      if (skip_animation == null) skip_animation = false;
      args = Ext.Object.merge({}, Lizard.CM.getContext(), params);
      href = '/portal/only_portal/#' + args.headertab.name + '/' + args.portal_template + '/' + args.object.type + '/' + args.object.id;
      return window.open(href, 'vss', 'width=800,height=600,scrollbars=yes');
    },
    linkToPopup: function(title, url, params, window_options, add_active_object_to_request, renderer, modal, reloadme) {
      var args, cont, me, success, window_settings;
      if (window_options == null) window_options = {};
      if (add_active_object_to_request == null) {
        add_active_object_to_request = true;
      }
      if (renderer == null) renderer = 'html';
      if (modal == null) modal = false;
      if (reloadme == null) reloadme = false;
      me = this;
      if (add_active_object_to_request) {
        cont = Lizard.CM.getContext();
        args = Ext.Object.merge(params, {
          object_id: cont.object.id,
          object_type: cont.object.type
        });
      }
      if (reloadme) {
        success = reloadGraphs;
      } else {
        success = Ext.emptyFn();
      }
      window_settings = {
        title: title,
        width: 800,
        height: 600,
        constrainHeader: true,
        autoScroll: true,
        bodyStyle: {
          background: 'white'
        },
        modal: modal,
        loader: {
          loadMask: true,
          autoLoad: true,
          url: url,
          ajaxOptions: {
            method: 'GET'
          },
          params: params,
          renderer: renderer,
          success: success
        }
      };
      if (window_options.save || window_options.search || window_options.plus) {
        window_settings.tools = [];
      }
      if (window_options.save) {
        window_settings.tools.push({
          type: 'save',
          tooltip: window_options.save[0],
          handler: function(e, target, panelHeader, tool) {
            return me.linkToPopup.apply(me, window_options.save);
          }
        });
      }
      if (window_options.plus) {
        window_settings.tools.push({
          type: 'plus',
          tooltip: window_options.plus[0],
          handler: function(e, target, panelHeader, tool) {
            return me.linkToPopup.apply(me, window_options.plus);
          }
        });
      }
      if (window_options.search) {
        window_settings.tools.push({
          type: 'search',
          tooltip: window_options.search[0],
          handler: function(e, target, panelHeader, tool) {
            return me.linkToPopup.apply(me, window_options.search);
          }
        });
      }
      return Ext.create('Ext.window.Window', window_settings).show();
    },
    loadPortal: function(params, area_selection_collapse, skip_animation, show_navigation) {
      var container, me, pos, tab, _ref,
        _this = this;
      if (area_selection_collapse == null) area_selection_collapse = true;
      if (skip_animation == null) skip_animation = false;
      if (show_navigation == null) show_navigation = true;
      if (show_navigation && params.object && ((_ref = typeof params.object.id) === 'null' || _ref === 'undefined') && params.headertab.navigation) {
        this.showNavigation(params.headertab.navigation);
        return true;
      }
      me = this;
      container = this.portalContainer;
      tab = this.portalContainer.child("#" + params.portal_template);
      if (tab) {
        pos = this.portalContainer.tabBar.items.indexOf(tab.tab);
        if (pos > 0) this.portalContainer.tabBar.move(pos, 0);
        this.portalContainer.setActiveTab(tab);
        tab.setContext(params);
        return this.header.setBreadCrumb(tab.breadcrumbs);
      } else {
        container.setLoading(true);
        return Ext.Ajax.request({
          url: '/portal/configuration/',
          params: {
            portal_template: params.portal_template
          },
          method: 'GET',
          success: function(xhr) {
            var newComponent;
            try {
              newComponent = Ext.decode(xhr.responseText);
              newComponent.params = Ext.merge({}, newComponent.params, Lizard.CM.getContext());
              if (!newComponent.navigation_only) {
                newComponent.headertab = Lizard.CM.context.headertab;
              }
              if (area_selection_collapse) {
                if (me.navigation) me.navigation.collapse();
              }
              tab = me.portalContainer.add(newComponent);
              pos = _this.portalContainer.tabBar.items.indexOf(tab.tab);
              if (pos > 0) _this.portalContainer.tabBar.move(pos, 0);
              me.portalContainer.setActiveTab(tab);
              if (!newComponent.navigation_only) {
                tab.on('activate', function(tab) {
                  return Lizard.CM.setContext({
                    headertab: tab.headertab,
                    portal_template: tab.params.portal_template
                  });
                });
              }
              me.portalContainer.setLoading(false);
              return me.header.setBreadCrumb(newComponent.breadcrumbs);
            } catch (error) {
              Ext.Msg.alert("Fout", "Fout in laden scherm. Error: " + error);
              return me.portalContainer.setLoading(false);
            }
          },
          failure: function(error) {
            console.log(error);
            Ext.Msg.alert("Fout", "Fout in ophalen van scherm. Error: " + error);
            return me.portalContainer.setLoading(false);
          }
        });
      }
    },
    showNavigation: function(navigation_id, animate_navigation_expand, expand_navigation, show_portal_template) {
      var args, navigation_tab;
      if (animate_navigation_expand == null) animate_navigation_expand = true;
      if (expand_navigation == null) expand_navigation = true;
      if (show_portal_template == null) show_portal_template = true;
      navigation_tab = this.navigation.getComponent(navigation_id);
      if (!navigation_tab) {
        console.log('navigation does not exist');
        return false;
      }
      if (navigation_id && navigation_tab) {
        this.navigation.setActiveTab(navigation_id);
        if (expand_navigation) {
          this.navigation.expand(animate_navigation_expand);
          this.navigation.doLayout();
        }
      }
      if (show_portal_template) {
        args = Ext.Object.merge({}, this.context_manager.getContext(), {
          portal_template: navigation_tab.selection_portal_template
        });
        this.loadPortal(args, false, false, false);
      }
      return true;
    },
    showTabMainpage: function(animate_navigation_expand, expand_navigation, show_portal_template) {
      var context, ht;
      if (animate_navigation_expand == null) animate_navigation_expand = true;
      if (expand_navigation == null) expand_navigation = true;
      if (show_portal_template == null) show_portal_template = true;
      context = Lizard.ContextManager.getContext();
      ht = context.headertab;
      if (ht.popup_navigation) {
        this.showNavigation(ht.navigation, true, true, ht.popup_navigation_portal);
      } else {
        this.linkTo({
          portal_template: ht.default_portal_template
        });
      }
      return true;
    },
    switchNavigation: function(headertab) {
      var obj, tab, _i, _len, _ref, _ref2;
      obj = headertab.object_types;
      _ref = this.navigation.items.items;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tab = _ref[_i];
        if (_ref2 = tab.object_type, __indexOf.call(obj, _ref2) >= 0) {
          tab.enable();
          this.navigation.setActiveTab(tab);
        } else {
          tab.disable();
        }
      }
      return this.navigation.doLayout();
    },
    updateOnContextChange: function(changes, changed_context, new_context) {
      this.loadPortal(new_context);
      return this.switchNavigation(new_context.headertab);
    },
    constructor: function(config) {
      this.initConfig(config);
      return this.callParent(arguments);
    },
    initComponent: function() {
      var me, navig, _i, _len, _ref;
      me = this;
      if (this.showOnlyPortal) {
        this.header = Ext.create('Lizard.window.Header', {
          region: 'north',
          id: 'header',
          height: 0,
          xtype: 'pageheader',
          context_manager: Lizard.ContextManager,
          header_tabs: this.header.headertabs,
          src_logo: this.header.src_logo,
          url_homepage: this.header.url_homepage,
          headertabs: this.header.headertabs,
          portalWindow: this
        });
        Ext.apply(this, {
          id: 'portalWindow',
          layout: {
            type: 'border'
          },
          defaults: {
            collapsible: true,
            floatable: false,
            split: true,
            frame: false
          },
          items: [
            this.header, {
              region: 'center',
              id: 'portalContainer',
              collapsible: false,
              plain: true,
              split: false,
              frame: false,
              xtype: 'tabpanel',
              tabPosition: 'bottom'
            }
          ]
        });
      } else {
        this.header = Ext.create('Lizard.window.Header', {
          region: 'north',
          id: 'header',
          height: 55,
          xtype: 'pageheader',
          context_manager: Lizard.ContextManager,
          header_tabs: this.header.headertabs,
          src_logo: this.header.src_logo,
          url_homepage: this.header.url_homepage,
          headertabs: this.header.headertabs,
          portalWindow: this
        });
        Ext.apply(this, {
          id: 'portalWindow',
          layout: {
            type: 'border'
          },
          defaults: {
            collapsible: true,
            floatable: false,
            split: true,
            frame: false
          },
          items: [
            this.header, {
              region: 'west',
              id: 'areaNavigation',
              title: 'Gebiedsselectie',
              animCollapse: 500,
              width: 250,
              collapsed: true,
              xtype: 'tabpanel',
              tabPosition: 'bottom',
              autoScroll: true,
              layout: 'fit',
              setNavigation: function(navigation) {
                var tab;
                tab = this.child(navigation);
                return this.setActiveTab(tab);
              },
              listeners: {
                expand: {
                  fn: function(panel) {
                    return panel.doLayout();
                  }
                }
              }
            }, {
              region: 'center',
              id: 'portalContainer',
              collapsible: false,
              plain: true,
              split: false,
              frame: false,
              xtype: 'tabpanel',
              tabPosition: 'bottom'
            }
          ]
        });
      }
      this.callParent(arguments);
      if (!this.showOnlyPortal) {
        this.navigation = Ext.getCmp('areaNavigation');
        _ref = this.navigation_tabs;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          navig = _ref[_i];
          this.navigation.add(navig);
        }
      }
      this.portalContainer = Ext.getCmp('portalContainer');
      return this;
    },
    afterRender: function() {
      var activetab, anim_setting, hash, parts;
      this.callParent(arguments);
      if (window.location.hash) {
        hash = window.location.hash;
        parts = hash.replace('#', '').split('/');
        Lizard.CM.setContext({
          headertab: parts[0],
          portal_template: parts[1],
          object: {
            type: parts[2],
            id: parts[3]
          }
        }, false, true, false);
      }
      if (!this.showOnlyPortal) {
        activetab = Lizard.CM.context.headertab;
        if (activetab.popup_navigation && !Lizard.CM.context.object.id) {
          anim_setting = this.navigation.animCollapse;
          this.navigation.animCollapse = false;
          this.navigation.animCollapse = anim_setting;
        }
      }
      Lizard.CM.on('contextchange', this.updateOnContextChange, this);
      this.loadPortal(Lizard.CM.getContext());
      return this.switchNavigation(Lizard.CM.context.headertab);
    }
  });

}).call(this);
