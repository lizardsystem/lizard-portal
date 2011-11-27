(function() {
  Ext.define('Lizard.window.Header', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.pageheader',
    config: {
      headertabs: [],
      context_manager: {},
      logo_url: '/static_media/vss/stowa_logo.png',
      portalWindow: null
    },
    setBreadCrumb: function(bread_crumbs) {
      var bread_div, crumb, el, element, me, portalWindow, _i, _len, _results;
      me = this;
      bread_div = this.breadcrumb.el;
      bread_div.dom.innerHTML = '';
      portalWindow = this.portalWindow;
      element = {
        tag: 'div',
        cls: 'link',
        html: '> ' + portalWindow.context_manager.getContext().object
      };
      bread_div.createChild(element);
      el = bread_div.last();
      el.addListener('click', function() {
        return portalWindow.showNavigationPortalTemplate();
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
            return portalWindow.linkTo({
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
    updateContextHeader: function() {
      var context, html;
      context = this.context_manager.getContext();
      html = '';
      if (context.object_type) {
        html += context.object_type + '<br>';
      }
      if (context.object_name) {
        html += context.object_name;
      }
      return this.contextheader.body.dom.innerHTML = html;
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
    constructor: function(config) {
      this.initConfig(config);
      return this.callParent(arguments);
    },
    initComponent: function() {
      var active_tab, header_items, me, pressed, print_object, tab, tabs, user, _i, _len;
      me = this;
      print_object = function(obj) {
        var output;
        output = "";
        Ext.Object.each(obj, function(key, value) {
          if (typeof value === 'object') {
            output += key + ":<br>";
            return Ext.Object.each(value, function(key2, value2) {
              return output += '....' + key2 + ": " + value2 + "<br>";
            });
          } else {
            return output += key + ": " + value + "<br>";
          }
        });
        return output;
      };
      header_items = [
        {
          xtype: 'tbspacer',
          width: 200
        }, '->'
      ];
      tabs = this.getHeadertabs();
      active_tab = this.context_manager.getActive_headertab();
      console.log('headers:');
      for (_i = 0, _len = tabs.length; _i < _len; _i++) {
        tab = tabs[_i];
        if (active_tab === tab) {
          pressed = true;
        } else {
          pressed = false;
        }
        console.log(tab);
        header_items.push({
          id: 'headertab_' + tab.name,
          text: tab.title,
          pressed: pressed,
          xtype: 'button',
          cls: 'l-headertab',
          toggleGroup: 'headertab',
          navigation: tab.navigation,
          tab: tab,
          handler: function() {
            var context;
            console.log(arguments);
            me.portalWindow.navigation.setNavigation(this.navigation);
            me.context_manager.setActiveHeadertab(this.tab);
            context = me.context_manager.getContext();
            if (context.object_id) {
              return me.portalWindow.linkTo({});
            } else {
              return me.portalWindow.showNavigationPortalTemplate();
            }
          }
        });
      }
      header_items.push('->');
      user = this.context_manager.getUser();
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
          text: user.name,
          xtype: 'button',
          componentCls: 'l-headertabs',
          menu: [
            {
              text: 'Instellingen',
              handler: function(button, event, eOpts) {
                return Ext.MessageBox.alert('release 2', 'release2');
              }
            }, {
              text: 'Toon huidige context',
              handler: function(button, event, eOpts) {
                return Ext.MessageBox.alert('release 2', print_object(me.context_manager.getContext()));
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
            y: 20,
            id: 'breadcrumb',
            cls: 'breadcrumb',
            height: 15,
            border: false,
            bodyStyle: {
              background: 'transparent',
              display: 'inline'
            },
            html: ''
          }, {
            x: 5,
            y: 5,
            width: 200,
            height: 45,
            border: false,
            bodyStyle: {
              background: 'transparent'
            },
            id: 'logo',
            html: '<img src="' + me.getLogo_url() + '"></img>'
          }, {
            x: 20,
            y: 30,
            height: 25,
            border: false,
            id: 'contextheader',
            bodyStyle: {
              'padding-right': '10px',
              background: 'transparent',
              'text-align': 'right',
              'font-size': '9px',
              color: '#555'
            },
            html: 'watersysteem<br>polderX'
          }
        ]
      });
      this.callParent(arguments);
      this.breadcrumb = Ext.getCmp('breadcrumb');
      this.contextheader = Ext.getCmp('contextheader');
      return this;
    }
  });
}).call(this);
