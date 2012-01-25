(function() {
  Ext.define('Lizard.window.ContextManager', {
    extend: 'Ext.util.Observable',
    config: {
      objects: {
        krw_waterlichaam: {
          object_id: null,
          object_name: '',
          object_type: 'krw_waterlichaam'
        },
        aan_afvoergebied: {
          object_id: null,
          object_name: '',
          object_type: 'aan_afvoergebied'
        },
        analyse_interpretatie: {
          object_id: null,
          object_name: '',
          object_type: 'analyse_interpretatie'
        }
      },
      last_selected_object: {
        object_type: null,
        object_id: null,
        object_name: null
      },
      headertabs: [],
      active_headertab: null,
      user: {
        id: '',
        name: '',
        usergroups: ''
      },
      period_start: Ext.Date.add(new Date(), Ext.Date.YEAR, -5),
      period_end: new Date(),
      period: {
        selection: 5
      },
      base_url: 'portal/site/vss/'
    },
    setActiveHeadertab: function(tab) {
      var context, pw;
      if (typeof tab === 'string') {
        tab = Ext.Array.filter(this.headertabs, function(element) {
          if (element.name === tab) {
            return element;
          }
        });
        if (tab.length > 0) {
          tab = tab[0];
        }
      }
      if (tab) {
        this.active_headertab = tab;
        context = this.getContext();
        pw = Ext.getCmp('portalWindow');
        if (pw) {
          if (context.object_id && this) {
            pw.linkTo({});
          } else {
            pw.showNavigationPortalTemplate();
          }
        }
      } else {
        console.log('headertab not found');
      }
      return tab;
    },
    setContext: function(params, save_state, headertab) {
      var context, headertab_change, object, object_change, object_type_change, period_change, tab, template_change;
      if (save_state == null) {
        save_state = true;
      }
      if (headertab == null) {
        headertab = this.active_headertab;
      }
      console.log('new context params are:');
      console.log(params);
      headertab_change = false;
      template_change = false;
      object_type_change = false;
      object_change = false;
      period_change = false;
      if (typeof params.headerTab !== 'undefined') {
        if (headertab.name !== params.headerTab) {
          tab = Ext.getCmp('headertab_' + params.headerTab);
          if (!tab.pressed) {
            tab.toggle();
          } else {
            this.setActiveHeadertab(params.headerTab);
          }
          headertab_change = true;
          headertab = this.active_headertab;
        }
      }
      if (typeof params.portalTemplate !== 'undefined') {
        if (headertab.portalTemplate !== params.portalTemplate) {
          headertab.portalTemplate = params.portalTemplate;
          template_change = true;
        }
      }
      if (typeof params.object_type !== 'undefined') {
        if (this.last_selected_object.object_type !== params.object_type) {
          if (typeof this.objects[params.object_type] === 'undefined') {
            this.objects[params.object_type] = {
              object_type: params.object_type
            };
          }
          this.last_selected_object = this.objects[params.object_type];
          object_type_change = true;
          object = this.last_selected_object;
        }
      }
      ({
        "else": object = this.last_selected_object
      });
      if (typeof params.object_id !== 'undefined') {
        if (object.object_id !== params.object_id) {
          object.object_id = params.object_id;
          object_change = true;
        }
      }
      if (typeof params.object_name !== 'undefined') {
        if (object.object_name !== params.object_name) {
          object.object_name = params.object_name;
        }
      }
      if (typeof params.period !== 'undefined') {
        this.period = params.period;
      }
      if (typeof params.period_start !== 'undefined') {
        if (Ext.typeOf(params.period_start) !== 'date') {
          params.period_start = Ext.Date.parse(params.period_start, 'd-m-Y');
        }
        if (this.period_start !== params.period_start) {
          this.period_start = params.period_start;
          period_change = true;
        }
      }
      if (typeof params.period_end !== 'undefined') {
        if (Ext.typeOf(params.period_end) !== 'date') {
          params.period_end = Ext.Date.parse(params.period_end, 'd-m-Y');
        }
        if (this.period_end !== params.period_end) {
          this.period_end = params.period_end;
          period_change = true;
        }
      }
      if (headertab_change || template_change || object_type_change || object_change || period_change) {
        console.log('contextchange');
        this.fireEvent('contextchange', {
          headertab: headertab_change,
          template: template_change,
          object_type: object_type_change,
          object: object_change,
          period: period_change
        }, this.getContext(), this);
      }
      if (save_state) {
        context = this.getContext(null, true);
        return window.history.pushState(context, "" + params, "" + this.base_url + "#" + context.active_headertab.name + "/" + context.portalTemplate + "/" + context.object_type + "/" + context.object_id);
      }
    },
    getContext: function(headertab, no_references) {
      var check, me, obj_type, object, output, _i, _len, _ref;
      if (headertab == null) {
        headertab = this.active_headertab;
      }
      if (no_references == null) {
        no_references = false;
      }
      me = this;
      if (headertab === null) {
        headertab = {};
      }
      output = {};
      if (no_references) {
        output.active_headertab = {
          name: headertab.name,
          active_portal_template: headertab.active_portal_template
        };
      } else {
        output.active_headertab = headertab;
      }
      check = function(el) {
        if (el === me.last_selected_object.object_type) {
          return true;
        }
      };
      if (headertab) {
        console.log('supported objecttypes are:');
        console.log(headertab.object_types);
        if (Ext.Array.some(headertab.object_types, check)) {
          object = this.last_selected_object;
          console.log('last selected object supported in context');
        } else {
          object = {};
          console.log('find last selected objects of supported types. Object cache is:');
          console.log(me.objects);
          _ref = headertab.object_types;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            obj_type = _ref[_i];
            console.log(obj_type);
            if (me.objects[obj_type]) {
              if (me.objects[obj_type].object_id) {
                console.log('found:');
                object = me.objects[obj_type];
                console.log(object);
                break;
              }
            }
          }
        }
      }
      output.object_type = object.object_type;
      output.object_id = object.object_id;
      output.object_name = object.object_name;
      output.portalTemplate = headertab.portalTemplate || headertab.default_portal_template;
      output.period = this.getPeriod();
      output.period_start = this.getPeriod_start();
      output.period_end = this.getPeriod_end();
      output.user = this.getUser();
      return output;
    },
    constructor: function(config) {
      this.initConfig(config);
      return this.callParent(arguments);
    },
    initComponent: function() {
      var me;
      me = this;
      this.addEvents(['contextchange']);
      Ext.apply(this, {
        id: 'context_manager'
      });
      return this.callParent(arguments);
    }
  });
}).call(this);
