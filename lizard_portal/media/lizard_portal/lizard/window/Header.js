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
      active_tab: ''
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
    logout: function() {
      return Ext.MessageBox.confirm('Loguit', 'Weet u zeker dat u uit wil loggen?', function(button) {
        if (button === 'yes') {
          return location.replace('/user/logout_redirect/?url=' + location.href);
        }
      });
    },
    login: function() {
      return Ext.create('Ext.window.Window', {
        title: 'Login',
        items: {
          frame: true,
          xtype: 'form',
          url: '/user/login_redirect/',
          bodyStyle: 'padding:5px 5px 0',
          width: 350,
          fieldDefaults: {
            msgTarget: 'side',
            labelWidth: 90
          },
          defaultType: 'textfield',
          defaults: {
            anchor: '100%'
          },
          items: [
            {
              fieldLabel: 'Gebruikernaam',
              name: 'username'
            }, {
              fieldLabel: 'Password',
              name: 'password',
              inputType: 'password'
            }, {
              xtype: 'displayfield',
              value: 'Wachtwoord <a href="' + url.auth_password_reset + '" target="_blank">vergeten</a> of <a href="' + url.auth_password_reset + '" target="_blank">wijzigen</a>?'
            }
          ],
          buttons: [
            {
              text: 'Login',
              formBind: true,
              handler: function() {
                var form;
                form = this.up('form').getForm();
                return form.submit({
                  clientValidation: true,
                  url: form.url,
                  success: function(form, action) {
                    var result;
                    result = Ext.JSON.decode(action.response.responseText);
                    if (result.success) {
                      return location.reload();
                    } else {
                      return Ext.Msg.alert('Fout', result.msg);
                    }
                  },
                  failure: function(form, action) {
                    var result;
                    result = Ext.JSON.decode(action.response.responseText);
                    return Ext.Msg.alert('Fout', result.msg);
                  }
                });
              }
            }, {
              text: 'Cancel',
              handler: function() {
                var window;
                window = this.up('window');
                return window.close();
              }
            }
          ]
        }
      }).show();
    },
    getActiveTab: function() {
      return Ext.getCmp('headertab_' + this.getActive_tab());
    },
    constructor: function(config) {
      this.initConfig(arguments);
      return this.callParent(arguments);
    },
    initComponent: function() {
      var header_items, me, pressed, tab, user, _i, _len, _ref;
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
        if (this.active_tab === tab.name) {
          pressed = true;
        } else {
          pressed = false;
        }
        header_items.push({
          id: 'headertab_' + tab.name,
          text: tab.title,
          pressed: pressed,
          xtype: 'button',
          cls: 'l-headertab',
          toggleGroup: 'headertab',
          navigation: tab.navigation,
          handler: function() {
            console.log(arguments);
            return Ext.getCmp('areaNavigation').add(this.navigation);
          }
        });
      }
      header_items.push('->');
      user = this.getUser();
      if (user.id === null) {
        header_items.push({
          text: 'Login',
          xtype: 'button',
          handler: function(button, event, eOpts) {
            return me.login();
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
              text: 'Log uit',
              handler: function(button, event, eOpts) {
                return me.logout();
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
        layout: 'absolute',
        layoutConfig: {
          itemCls: 'l-headertab'
        },
        items: [
          {
            x: 0,
            y: 0,
            xtype: 'toolbar',
            cls: 'l-header',
            items: header_items
          }, {
            x: 250,
            y: 30,
            id: 'breadcrumb',
            html: 'breadcrumb'
          }, {
            x: 5,
            y: 5,
            width: 200,
            height: 45,
            id: 'logo',
            html: 'logo'
          }
        ]
      });
      return this.callParent(arguments);
    }
  });
}).call(this);
