(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Ext.define('Lizard.window.Screen', {
    extend: 'Ext.container.Viewport',
    config: {
      header: {
        src_logo: 'vss/stowa_logo.png',
        url_homepage: '/',
        headertabs: []
      },
      context_manager: null
    },
    setBreadCrumb: function(bread_crumbs) {
      return this.header.setBreadCrumb(bread_crumbs);
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
      console.log('linkTo, with params:');
      console.log(params);
      this.context_manager.setContext(params, save_state);
      console.log('linkTo, after setContext context is:');
      console.log(this.context_manager.getContext());
      console.log(this.header);
      this.header.updateContextHeader();
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
      console.log("load portal with portalTemplate '" + params.portalTemplate + "' and params:");
      console.log(params);
      me = this;
      container = this.portalContainer;
      tab = this.portalContainer.child("#" + params.portalTemplate);
      if (tab) {
        this.portalContainer.setActiveTab(tab);
        tab.setContext(params);
        return this.setBreadCrumb(tab.breadcrumbs);
      } else {
        container.setLoading(true);
        return Ext.Ajax.request({
          url: '/portal/configuration/',
          params: params,
          method: 'GET',
          success: __bind(function(xhr) {
            var newComponent;
            newComponent = eval('eval( ' + xhr.responseText + ')');
            newComponent.params = Ext.merge({}, newComponent.params, me.context_manager.getContext());
            console.log('params of new component are:');
            console.log(newComponent.params);
            if (area_selection_collapse) {
              me.navigation.collapse();
            }
            tab = me.portalContainer.add(newComponent);
            me.portalContainer.setActiveTab(tab);
            me.portalContainer.setLoading(false);
            return me.setBreadCrumb(newComponent.breadcrumbs);
          }, this),
          failure: __bind(function() {
            Ext.Msg.alert("portal creation failed", "Server communication failure");
            return me.portalContainer.setLoading(false);
          }, this)
        });
      }
    },
    showNavigationPortalTemplate: function(animate_navigation_expand) {
      var args;
      this.navigation.expand(animate_navigation_expand);
      args = Ext.Object.merge({}, this.context_manager.getContext(), {
        portalTemplate: this.context_manager.active_headertab.navigation_portal_template
      });
      return this.loadPortal(args, false);
    },
    constructor: function(config) {
      this.initConfig(config);
      return this.callParent(arguments);
    },
    initComponent: function() {
      var me;
      me = this;
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
              tab = this.child("#" + navigation.id);
              if (!tab) {
                tab = this.add(navigation);
              }
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
      this.callParent(arguments);
      this.navigation = Ext.getCmp('areaNavigation');
      this.portalContainer = Ext.getCmp('portalContainer');
      return this;
    },
    afterRender: function() {
      var activeTab, anim_setting, hash, parts, tab;
      this.callParent(arguments);
      activeTab = this.context_manager.getActive_headertab();
      if (activeTab) {
        tab = this.navigation.add(activeTab.navigation);
        this.navigation.setActiveTab(tab);
      }
      if (window.location.hash) {
        hash = window.location.hash;
        parts = hash.replace('#', '').split('/');
        this.linkTo({
          portalTemplate: parts[0],
          object: parts[1],
          object_id: parts[2]
        }, false, true, false);
      }
      if (!this.context_manager.getContext().object_id) {
        console.log('no object selected, show selection');
        anim_setting = this.navigation.animCollapse;
        this.navigation.animCollapse = false;
        this.navigation.expand(false);
        this.navigation.animCollapse = anim_setting;
        return this.showNavigationPortalTemplate(false);
      }
    }
  });
}).call(this);
