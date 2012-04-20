(function() {
  var __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Ext.define('Lizard.window.Header', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.pageheader',
    config: {
      headertabs: [],
      context_manager: {},
      logo_url: '/static_media/vss/stowa_logo.png',
      portalWindow: null,
      close_on_logout: false
    },
    setBreadCrumb: function(bread_crumbs) {
      var area_name, bread_div, context, crumb, el, element, me, _i, _len, _results;
      me = this;
      bread_div = this.breadcrumb.el;
      bread_div.dom.innerHTML = '';
      context = Lizard.CM.getContext();
      area_name = context.headertab.name || 'tab';
      element = {
        tag: 'div',
        cls: 'link',
        html: '> ' + area_name
      };
      bread_div.createChild(element);
      el = bread_div.last();
      el.addListener('click', function() {
        me.context_manager.setContext({
          portal_template: null
        });
        return me.portalWindow.showTabMainpage();
      });
      if (bread_crumbs) {
        bread_div.createChild({
          tag: 'div',
          html: ' - '
        });
        _results = [];
        for (_i = 0, _len = bread_crumbs.length; _i < _len; _i++) {
          crumb = bread_crumbs[_i];
          if (crumb.link) {
            element = {
              tag: 'div',
              cls: 'link',
              html: crumb.name
            };
            bread_div.createChild(element);
            el = bread_div.last();
            el.addListener('click', function(evt, obj, crumb_l) {
              return me.portalWindow.linkTo({
                portal_template: crumb_l.link
              });
            }, this, crumb);
            _results.push(bread_div.createChild({
              tag: 'div',
              html: ' - '
            }));
          } else {
            _results.push(bread_div.createChild({
              tag: 'div',
              html: crumb.name
            }));
          }
        }
        return _results;
      }
    },
    updateContextPeriodHeader: function(context) {
      var html;
      html = '';
      html += Ext.Date.format(context.period.start, 'd-m-Y') + '-<br>' + Ext.Date.format(context.period.end, 'd-m-Y') + ' ';
      if (this.contextheader_period) {
        return this.contextheader_period.el.dom.innerHTML = html;
      }
    },
    updateContextAreaHeader: function(context) {
      var html, obj_str;
      html = '';
      if (Lizard.CM.objects.krw_waterlichaam) {
        obj_str = Lizard.CM.objects.krw_waterlichaam.name + ' (' + Lizard.CM.objects.krw_waterlichaam.id + ')';
        if (__indexOf.call(Lizard.CM.getContext().headertab.object_types, 'krw_waterlichaam') >= 0) {
          obj_str = '<b>' + obj_str + '</b>';
        }
        html += obj_str;
      }
      html += '<br>';
      if (Lizard.CM.objects.aan_afvoergebied) {
        obj_str = Lizard.CM.objects.aan_afvoergebied.name + ' (' + Lizard.CM.objects.aan_afvoergebied.id + ')';
        if (__indexOf.call(Lizard.CM.getContext().headertab.object_types, 'aan_afvoergebied') >= 0) {
          obj_str = '<b>' + obj_str + '</b>';
        }
        html += obj_str;
      }
      return this.contextheader_area.el.dom.innerHTML = html;
    },
    logout: function() {
      var me;
      me = this;
      return Ext.MessageBox.confirm('Loguit', 'Weet u zeker dat u uit wil loggen?', function(button) {
        if (button === 'yes') {
          window.onunload = null;
          return location.replace('/user/logout_redirect/');
        }
      });
    },
    login: function() {
      var basic, log_me_in, login_window;
      log_me_in = function(form) {
        var basic;
        console.log('submit login');
        basic = form.getForm();
        return form.submit({
          clientValidation: true,
          url: form.url,
          params: {
            check: true
          },
          success: function(form, action) {
            var result;
            window.onunload = null;
            result = Ext.JSON.decode(action.response.responseText);
            if (result.success) {
              Ext.get('username').dom.value = basic.findField('username').getValue();
              Ext.get('password').dom.value = basic.findField('password').getValue();
              return document.forms["loginform"].submit();
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
      };
      login_window = Ext.create('Ext.window.Window', {
        id: 'login_window',
        title: 'Login',
        items: {
          frame: true,
          xtype: 'form',
          url: '/user/login_redirect/',
          bodyStyle: 'padding:5px 5px 0',
          width: 350,
          standardSubmit: false,
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
              name: 'username',
              allowBlank: false
            }, {
              fieldLabel: 'Password',
              name: 'password',
              inputType: 'password',
              allowBlank: false
            }, {
              xtype: 'displayfield',
              value: 'Wachtwoord <a href="' + url.auth_password_reset + '" target="_blank">vergeten</a>?'
            }
          ],
          buttons: [
            {
              id: 'login_button',
              text: 'Login',
              formBind: true,
              handler: function() {
                var form;
                form = this.up('form');
                return log_me_in(form);
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
      basic = login_window.down('form').getForm();
      basic.findField('username').setValue(Ext.get('username').dom.value);
      basic.findField('password').setValue(Ext.get('password').dom.value);
      return new Ext.util.KeyMap(login_window.getEl(), {
        key: Ext.EventObject.ENTER,
        fn: function() {
          var form;
          form = login_window.down('form');
          return log_me_in(form);
        }
      });
    },
    periodSelection: function() {
      var windows;
      windows = Ext.WindowManager.getBy(function(obj) {
        if (obj.is_period_selection) {
          return true;
        } else {
          return false;
        }
      });
      if (windows.length > 0) {
        return Ext.WindowManager.bringToFront(windows[0]);
      } else {
        return Ext.create('Ext.window.Window', {
          title: 'Periode selectie',
          is_period_selection: true,
          items: {
            frame: true,
            xtype: 'form',
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
                xtype: 'radiogroup',
                name: 'period_selection',
                id: 'ps',
                fieldLabel: 'Periode',
                columns: 3,
                vertical: false,
                items: Lizard.CM.periods,
                listeners: {
                  change: function(field, new_value, old_value, optional) {
                    var form, selected;
                    selected = field.getChecked()[0];
                    form = field.up('form').getForm();
                    if (new_value.period !== 0) {
                      form.findField('period_start').setValue(Ext.Date.add(new Date(), selected.dt[0], selected.dt[1]));
                      form.findField('period_end').setValue(new Date());
                      form.findField('period_start').setDisabled(true);
                      return form.findField('period_end').setDisabled(true);
                    } else {
                      form.findField('period_start').setDisabled(false);
                      return form.findField('period_end').setDisabled(false);
                    }
                  }
                }
              }, {
                xtype: 'datefield',
                fieldLabel: 'van',
                name: 'period_start',
                format: 'd-m-Y'
              }, {
                xtype: 'datefield',
                fieldLabel: 't/m',
                name: 'period_end',
                format: 'd-m-Y'
              }
            ],
            buttons: [
              {
                text: 'Ok',
                formBind: true,
                handler: function() {
                  var end, form, start, values, window;
                  form = this.up('form').getForm();
                  if (form.isValid()) {
                    start = form.findField('period_start').getValue();
                    end = form.findField('period_end').getValue();
                    if (end > start) {
                      values = form.getValues();
                      console.log(values);
                      Lizard.ContextManager.setContext({
                        period_start: start,
                        period_end: end,
                        period: {
                          type: values.period,
                          start: start,
                          end: end
                        }
                      });
                      window = this.up('window');
                      return window.close();
                    } else {
                      return Ext.MessageBox.alert('Invoer fout', 'Begin datum moet voor eind datum zijn.');
                    }
                  } else {
                    return Ext.MessageBox.alert('Invoer fout', 'Kies geldige periode');
                  }
                }
              }, {
                text: 'Cancel',
                handler: function() {
                  var window;
                  window = this.up('window');
                  return window.close();
                }
              }
            ],
            afterRender: function() {
              var context, form, ps;
              form = this.getForm();
              ps = form.findField('period_selection');
              context = Lizard.CM.getContext();
              form.findField('period_start').setValue(context.period.start);
              form.findField('period_end').setValue(context.period.end);
              return ps.setValue({
                period: context.period.type
              });
            }
          }
        }).show();
      }
    },
    showContext: function() {
      var group, output, user, _i, _len, _ref;
      user = Lizard.CM.context.user;
      output = '';
      output += 'naam: ' + user.name + '<br>';
      output += 'organisatie: ' + user.organization + '<br>';
      output += 'rechten:<br>';
      _ref = user.groups;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        group = _ref[_i];
        output += '   ' + group + '<br>';
      }
      if (Lizard.CM.getContext().background_layer) {
        output += 'Achtergrond: ' + Lizard.CM.getContext().background_layer.title + '<br>';
      }
      return Ext.MessageBox.alert('Gebruikers informatie', output);
    },
    constructor: function(config) {
      this.initConfig(config);
      return this.callParent(arguments);
    },
    initComponent: function() {
      var active_tab, context, header_items, me, menu, pressed, tab, tabs, user, xtype, _i, _len;
      me = this;
      tabs = this.getHeadertabs();
      context = Lizard.CM.context;
      header_items = [
        {
          xtype: 'tbspacer',
          width: 200
        }, '->'
      ];
      active_tab = context.headertab;
      for (_i = 0, _len = tabs.length; _i < _len; _i++) {
        tab = tabs[_i];
        if (active_tab === tab) {
          pressed = true;
        } else {
          pressed = false;
        }
        if (tab.config.menu) {
          xtype = 'splitbutton';
          menu = tab.config.menu;
        } else {
          xtype = 'button';
          menu = null;
        }
        header_items.push({
          id: 'headertab_' + tab.name,
          text: tab.title,
          pressed: pressed,
          xtype: xtype,
          menu: menu,
          plain: true,
          cls: 'l-headertab',
          toggleGroup: 'headertab',
          headertab: tab,
          handler: function() {
            if (!this.pressed) this.toggle();
            return Lizard.CM.setContext({
              headertab: this.headertab
            });
          }
        });
      }
      header_items.push('->');
      user = this.context_manager.context.user;
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
              text: 'Over deze versie',
              handler: function(button, event, eOpts) {
                return Ext.create('Ext.window.Window', {
                  title: 'VSS',
                  autoLoad: {
                    url: '/version/'
                  },
                  width: 400,
                  height: 100,
                  modal: true
                }).show();
              }
            }, {
              text: 'Toon informatie gebruiker',
              handler: function(button, event, eOpts) {
                return me.showContext();
              }
            }, '-', {
              text: 'Andere gebruiker',
              handler: function(button, event, eOpts) {
                Lizard.CM.saveContext();
                return me.login();
              }
            }, {
              text: 'Log uit',
              handler: function(button, event, eOpts) {
                Lizard.CM.saveContext();
                return me.logout();
              }
            }
          ]
        }, '-', {
          id: 'contextheader_period',
          cls: 'l-header-contextinfo',
          html: '',
          border: false,
          xtype: 'component',
          width: 55
        }, {
          iconCls: 'l-icon-clock',
          xtype: 'button',
          bodyCls: 'l-headertab',
          handler: function() {
            return me.periodSelection();
          }
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
            y: 30,
            width: '100%',
            height: 25,
            border: false,
            id: 'contextheader_area',
            cls: 'l-header-contextinfo-area',
            html: '',
            xtype: 'component'
          }, {
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
            html: '<a href="/"><img src="' + me.getLogo_url() + '"></img></a>'
          }
        ]
      });
      this.portalWindow.context_manager.on('contextchange', function(change, changed_objects, new_context, context_m) {
        return me._updateOnContextChange(change, changed_objects, new_context, context_m);
      });
      this.callParent(arguments);
      this.breadcrumb = Ext.getCmp('breadcrumb');
      this.contextheader_area = Ext.getCmp('contextheader_area');
      this.contextheader_period = Ext.getCmp('contextheader_period');
      if (Lizard.CM.getContext().user.id === null) this.login();
      return this;
    },
    afterRender: function() {
      var context;
      this.callParent(arguments);
      context = Lizard.CM.getContext();
      this.updateContextAreaHeader(context);
      return this.updateContextPeriodHeader(context);
    },
    _updateOnContextChange: function(change, changed_objects, new_context, context_m) {
      var tab;
      this.updateContextAreaHeader(new_context);
      this.updateContextPeriodHeader(new_context);
      tab = Ext.getCmp('headertab_' + new_context.headertab.name);
      if (!tab.pressed) return tab.toggle();
    }
  });

}).call(this);
