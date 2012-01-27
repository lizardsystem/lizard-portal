(function() {
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
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
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
      if (save_state == null) {
        save_state = true;
      }
      if (area_selection_collapse == null) {
        area_selection_collapse = true;
      }
      if (skip_animation == null) {
        skip_animation = false;
      }
      console.log('linkTo, with arguments:');
      console.log(arguments);
      this.context_manager.setContext(params, save_state);
      return this.loadPortal(this.context_manager.getContext(), area_selection_collapse, skip_animation);
    },
    loadPortal: function(params, area_selection_collapse, skip_animation) {
      var container, me, tab;
      if (area_selection_collapse == null) {
        area_selection_collapse = true;
      }
      if (skip_animation == null) {
        skip_animation = false;
      }
      console.log("load portal with portalTemplate '" + params.portalTemplate + "' and arguments:");
      console.log(arguments);
      me = this;
      container = this.portalContainer;
      tab = this.portalContainer.child("#" + params.portalTemplate);
      if (tab) {
        this.portalContainer.setActiveTab(tab);
        tab.setContext(params);
        return this.header.setBreadCrumb(tab.breadcrumbs);
      } else {
        container.setLoading(true);
        return Ext.Ajax.request({
          url: '/portal/configuration/',
          params: {
            portalTemplate: params.portalTemplate
          },
          method: 'GET',
          success: __bind(function(xhr) {
            var newComponent;
            try {
              newComponent = Ext.decode(xhr.responseText);
              newComponent.params = Ext.merge({}, newComponent.params, me.context_manager.getContext());
              if (area_selection_collapse) {
                if (me.navigation) {
                  me.navigation.collapse();
                }
              }
              tab = me.portalContainer.add(newComponent);
              me.portalContainer.setActiveTab(tab);
              me.portalContainer.setLoading(false);
              return me.header.setBreadCrumb(newComponent.breadcrumbs);
            } catch (error) {
              Ext.Msg.alert("Fout", "Fout in laden scherm. Error: " + error);
              return me.portalContainer.setLoading(false);
            }
          }, this),
          failure: __bind(function(error) {
            console.log(error);
            Ext.Msg.alert("Fout", "Fout in ophalen van scherm. Error: " + error);
            return me.portalContainer.setLoading(false);
          }, this)
        });
      }
    },
    showNavigation: function(navigation_id, animate_navigation_expand, expand_navigation, show_portal_template) {
      var args, navigation_tab;
      if (animate_navigation_expand == null) {
        animate_navigation_expand = true;
      }
      if (expand_navigation == null) {
        expand_navigation = true;
      }
      if (show_portal_template == null) {
        show_portal_template = true;
      }
      navigation_tab = this.navigation.getComponent(navigation_id);
      if (!navigation_tab) {
        console.log('navigation does not exist');
        return false;
      }
      if (navigation_id && navigation_tab) {
        this.navigation.setActiveTab(navigation_id);
        if (expand_navigation) {
          this.navigation.expand(animate_navigation_expand);
        }
      }
      if (show_portal_template) {
        args = Ext.Object.merge({}, this.context_manager.getContext(), {
          portalTemplate: navigation_tab.selection_portal_template
        });
        this.loadPortal(args, false);
      }
      return true;
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
          context_manager: this.getContext_manager(),
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
          context_manager: this.getContext_manager(),
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
              title: 'Navigatie',
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
      var activeTab, anim_setting, hash, parts;
      this.callParent(arguments);
      if (window.location.hash) {
        hash = window.location.hash;
        parts = hash.replace('#', '').split('/');
        this.linkTo({
          headerTab: parts[0],
          portalTemplate: parts[1],
          object_type: parts[2],
          object_id: parts[3]
        }, false, true, false);
      }
      if (!this.showOnlyPortal) {
        activeTab = this.context_manager.getActive_headertab();
        if (activeTab.popup_navigation && !this.context_manager.getContext().object_id) {
          console.log('no object selected, show selection');
          anim_setting = this.navigation.animCollapse;
          this.navigation.animCollapse = false;
          this.context_manager.showNavigationIfNeeded(false);
          return this.navigation.animCollapse = anim_setting;
        }
      }
    }
  });
}).call(this);
