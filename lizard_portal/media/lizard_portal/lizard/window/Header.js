(function() {
  Ext.define('Lizard.window.Header', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.pageheader',
    config: {
      tabs: [],
      user: {
        id: null,
        name: ''
      },
      activetab: 0
    },
    setBreadCrumb: function(bread_crumbs) {
      var a, bread_div, breadcrumb, crumb, el, element, me, _i, _len, _results;
      me = this;
      breadcrumb = Ext.getCmp('breadcrumb');
      bread_div = breadcrumb.el;
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
    constructor: function(config) {
      this.initConfig(arguments);
      return this.callParent(arguments);
    },
    initComponent: function() {
      var header_items, me, tab, user, _i, _len, _ref;
      me = this;
      header_items = [
        {
          xtype: 'tbspacer',
          width: 200
        }, '->'
      ];
      _ref = this.tabs;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tab = _ref[_i];
        header_items.push({
          text: tab.title,
          xtype: 'button',
          cls: 'l-headertab',
          toggleGroup: 'headertab'
        });
      }
      header_items.push('->');
      user = this.getUser();
      if (user.id === null) {
        header_items.push({
          text: 'login',
          xtype: 'button',
          handler: function(button, event, eOpts) {
            return Ext.MessageBox.alert('TO DO', 'TO DO');
          },
          componentCls: 'l-headertabs'
        });
      } else {
        header_items.push({
          text: this.getUser().name,
          xtype: 'button',
          componentCls: 'l-headertabs',
          menu: [
            {
              text: 'Instellingen',
              handler: function(button, event, eOpts) {
                return Ext.MessageBox.alert('release 2', 'release2');
              }
            }, '-', {
              text: 'log uit',
              handler: function(button, event, eOpts) {
                return Ext.MessageBox.alert('TO DO', 'TO DO');
              }
            }
          ],
          listeners: {
            mouseover: {
              fn: function(button, event, eOpts) {
                return console.log('over user');
              }
            }
          }
        }, '-', {
          iconCls: 'settings',
          xtype: 'button',
          bodyCls: 'l-headertab'
        });
      }
      Ext.apply(this, {
        collapsible: false,
        floatable: false,
        split: false,
        frame: false,
        border: false,
        bodyStyle: {
          background: 'transparent'
        },
        items: [
          {
            xtype: 'toolbar',
            cls: 'l-header',
            items: header_items
          }, {
            id: 'breadcrumb',
            html: 'breadcrumb'
          }, {
            id: 'logo',
            html: 'logo'
          }
        ]
      });
      this.callParent(arguments);
      return this;
    },
    afterRender: function() {
      return this.callParent(arguments);
    }
  });
}).call(this);
