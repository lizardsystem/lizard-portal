(function() {
  Ext.define('Lizard.window.ContextManager', {
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
        permission_description: 'viewer',
        permissions: []
      },
      period_time: {
        period_start: '2000-01-01T00:00',
        period_end: '2002-01-01T00:00',
        moment: '2001-01-01T00:00'
      },
      base_url: 'portal/site/vss/'
    },
    setActiveHeadertab: function(tab) {
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
      } else {
        console.log('headertab not found');
      }
      return tab;
    },
    setContext: function(params, save_state, headertab) {
      var context, object, object_change, object_type_change, template_change;
      if (save_state == null) {
        save_state = true;
      }
      if (headertab == null) {
        headertab = this.active_headertab;
      }
      console.log('new context params are:');
      console.log(params);
      if (typeof params.portalTemplate !== 'undefined') {
        if (headertab.portalTemplate !== params.portalTemplate) {
          headertab.portalTemplate = params.portalTemplate;
          template_change = true;
          console.log('new portal template');
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
          console.log('new object type');
        }
      }
      ({
        "else": object = this.last_selected_object
      });
      if (typeof params.object_id !== 'undefined') {
        if (object.object_id !== params.object_id) {
          console.log('new object id');
          object.object_id = params.object_id;
          object_change = true;
        }
      }
      if (typeof params.object_name !== 'undefined') {
        if (object.object_name !== params.object_name) {
          console.log('new object name');
          object.object_name = params.object_name;
        }
      }
      if (save_state) {
        try {
          context = this.context_manager.getContext();
          return window.history.pushState(context, "" + params, "" + this.base_url + "#" + this.context.active_headertab.id + "/" + this.context.portalTemplate + "/" + this.context.object_type + "/" + this.context.object_id);
        } catch (error) {
          return console.log("not able to set pushState");
        }
      }
    },
    getContext: function(headertab) {
      var check, me, obj_type, object, output, _i, _len, _ref;
      if (headertab == null) {
        headertab = this.active_headertab;
      }
      me = this;
      if (headertab === null) {
        headertab = {};
      }
      output = {};
      output.active_headertab = headertab;
      output.period = this.period_time;
      check = function(el) {
        if (el === me.last_selected_object.object_type) {
          return true;
        }
      };
      object = this.last_selected_object;
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
      return output;
    },
    constructor: function(config) {
      this.initConfig(config);
      return this.callParent(arguments);
    },
    initComponent: function() {
      var me;
      me = this;
      Ext.apply(this, {
        id: 'context_manager'
      });
      return this.callParent(arguments);
    }
  });
}).call(this);
