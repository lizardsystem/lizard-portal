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
      active_tab: '',
      logo_url: '/static_media/vss/stowa_logo.png'
    },
    setBreadCrumb: function(bread_crumbs) {
      var bread_div, crumb, el, element, me, portalWindow, _i, _len, _results;
      bread_crumbs = bread_crumbs[0];
      me = this;
      bread_div = Ext.get('breadcrumb');
      bread_div.dom.innerHTML = '';
      portalWindow = Ext.getCmp('portalWindow');
      element = {
        tag: 'div',
        cls: 'link',
        html: '> ' + portalWindow.lizard_context.object
      };
      bread_div.createChild(element);
      el = bread_div.last();
      el.addListener('click', function() {
        return portalWindow.showAreaSelection();
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
          }
        ]
      });
      return this.callParent(arguments);
    }
  });
}).call(this);
