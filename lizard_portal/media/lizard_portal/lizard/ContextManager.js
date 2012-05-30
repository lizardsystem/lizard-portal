(function() {
  var __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Ext.define('Lizard.ContextManager', {
    extend: 'Ext.AbstractManager',
    alternateClassName: 'Lizard.CM',
    mixins: {
      observable: 'Ext.util.Observable'
    },
    singleton: true,
    setContext: function(params, save_state, headertab) {
      if (save_state == null) save_state = true;
      if (headertab == null) headertab = this.active_headertab;
      return this._setContext(params, save_state, headertab);
    },
    setConfiguration: function(params) {
      if (params.context) {
        this.context = Ext.Object.merge(this.context, params.context);
        delete params.context;
      }
      return Ext.apply(this, params);
    },
    objects: {},
    headertabs: [],
    periods: [
      {
        boxLabel: 'dg',
        name: 'period',
        inputValue: 1,
        dt: [Ext.Date.DAY, -1]
      }, {
        boxLabel: '2dg',
        name: 'period',
        inputValue: 2,
        dt: [Ext.Date.DAY, -2]
      }, {
        boxLabel: 'wk',
        name: 'period',
        inputValue: 3,
        dt: [Ext.Date.DAY, -7]
      }, {
        boxLabel: 'mnd',
        name: 'period',
        inputValue: 4,
        dt: [Ext.Date.MONTH, -1]
      }, {
        boxLabel: 'jr',
        name: 'period',
        inputValue: 5,
        dt: [Ext.Date.YEAR, -1]
      }, {
        boxLabel: '5jr',
        name: 'period',
        inputValue: 6,
        dt: [Ext.Date.YEAR, -5]
      }, {
        boxLabel: 'anders',
        name: 'period',
        inputValue: 0,
        dt: [null, null]
      }
    ],
    context: {
      period_start: Ext.Date.add(new Date(), Ext.Date.YEAR, -5),
      period_end: new Date(),
      period: {
        start: Ext.Date.add(new Date(), Ext.Date.YEAR, -5),
        end: new Date(),
        type: 6
      },
      user: {
        id: '',
        name: '',
        usergroups: ''
      },
      base_url: 'portal/site/vss/',
      background_layer: ''
    },
    _setObjectOfType: function(object) {
      if (typeof object === 'string') {
        object = {
          type: object
        };
      }
      this.objects[object.type] = Ext.Object.merge({
        id: null,
        name: '',
        type: ''
      }, object);
      return this.objects[object.type];
    },
    _checkChangeAndUpdate: function(context_param, new_param) {
      var new_value, updated;
      if (typeof new_param === 'undefined') return false;
      new_value = {};
      updated = false;
      if (Ext.type(new_param) === 'object') {
        Ext.Object.each(new_param, function(key, value) {
          var _ref;
          if (!context_param || (_ref = !key, __indexOf.call(context_param, _ref) >= 0)) {
            updated = true;
            new_value[key] = value;
          } else if (value !== context_param[key]) {
            updated = true;
            new_value[key] = value;
          }
        });
      } else {
        if (context_param !== new_param) {
          updated = true;
          new_value = new_param;
        }
      }
      if (updated) {
        return new_value;
      } else {
        return null;
      }
    },
    _setContext: function(params, save_state, silent) {
      var changed_context, changed_elements, headertab_name, me, new_context, obj_type, object, _i, _len, _ref;
      if (save_state == null) save_state = true;
      if (silent == null) silent = false;
      me = this;
      changed_context = {};
      Ext.Object.each(params, function(key, value) {
        var new_value;
        new_value = me._checkChangeAndUpdate(me.context[key], value);
        if (new_value !== null) changed_context[key] = new_value;
      });
      if (changed_context.headertab) changed_context.headertab = params.headertab;
      if (Ext.Object.getKeys(changed_context).length !== 0) {
        if (changed_context['headertab'] && typeof changed_context.headertab === 'string') {
          changed_context.headertab = Ext.Array.filter(this.headertabs, function(element) {
            if (element.name === changed_context.headertab) return element;
          });
          if (changed_context.headertab.length > 0) {
            changed_context.headertab = changed_context.headertab[0];
          }
        }
        if (changed_context['headertab'] && !params['portal_template']) {
          changed_context['portal_template'] = changed_context.headertab.default_portal_template;
        }
        if (changed_context['period']) {
          changed_context['period'] = this.calcPeriod(Ext.Object.merge({}, this.context['period'], changed_context['period']));
        }
        this.context = Ext.Object.merge(me.context, changed_context);
        if (changed_context['object']) {
          if (!changed_context.object['type']) {
            changed_context.object.type = this.context.object.type;
          }
          this._setObjectOfType(changed_context.object);
        }
        if (this.context.headertab) {
          object = {};
          _ref = this.context.headertab.object_types;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            obj_type = _ref[_i];
            if (me.objects[obj_type]) {
              if (me.objects[obj_type].id) {
                object = Ext.Object.merge({}, this.objects[obj_type]);
                break;
              }
            }
          }
          this.context.object = object;
          changed_context.object = object;
        }
        changed_elements = {};
        Ext.Object.each(changed_context, function(key, value) {
          changed_elements[key] = true;
        });
        new_context = this.getContext();
        if (!silent) {
          this.fireEvent('contextchange', changed_elements, changed_context, new_context, this);
        }
        if (save_state) {
          try {
            headertab_name = new_context.headertab.name;
            new_context = Ext.Object.merge({}, new_context, {
              headertab: headertab_name,
              active_headertab: headertab_name
            });
            return window.history.pushState(new_context, "" + params, "" + new_context.base_url + "#" + headertab_name + "/" + new_context.portal_template);
          } catch (error) {
            return console.log("not able to set pushState");
          }
        }
      }
    },
    calcPeriod: function(period) {
      var output, selected_type;
      output = {};
      if (period.start && typeof period.start === 'string') {
        period.start = Ext.Date.parse(period.start, 'Y-m-d');
      }
      if (period.end && typeof period.end === 'string') {
        period.end = Ext.Date.parse(period.end, 'Y-m-d');
      }
      if (period.type === 0 || !period.start || !period.end) {
        if (period.start && period.end) {
          output = period;
        } else if (period.start) {
          output = period;
          output.end = new Date();
        } else if (period.end) {
          output = period;
          output.start = Ext.Date.add(period.end, Ext.Date.YEAR, -1);
        } else {
          output.end = new Date();
          output.start = Ext.Date.add(output.end, Ext.Date.YEAR, -1);
          output.type = 0;
        }
      } else {
        selected_type = Ext.Array.filter(this.periods, function(obj) {
          if (obj.inputValue === period.type) {
            return true;
          } else {
            return false;
          }
        })[0];
        output.end = new Date();
        output.start = Ext.Date.add(new Date(), selected_type.dt[0], selected_type.dt[1]);
        output.type = period.type;
      }
      return output;
    },
    getContext: function(headertab, no_references) {
      var me, output;
      if (headertab == null) headertab = null;
      if (no_references == null) no_references = false;
      if (headertab !== null) {
        console.log('is headertab support outside active really needed. not supported anymore');
      }
      if (no_references) {
        console.log('is no_references support outside active really needed. not supported anymore');
      }
      me = this;
      output = this.context;
      output.active_headertab = this.context.headertab;
      return output;
    },
    saveContext: function() {
      var context, me, portalWindow,
        _this = this;
      me = Lizard.CM;
      if (me.context && me.context.user && me.context.user.id) {
        console.log('Saving context...');
        context = Ext.JSON.encode({
          objects: me.objects,
          context: {
            period: {
              start: Ext.Date.format(me.context.period.start, 'Y-m-d'),
              end: Ext.Date.format(me.context.period.end, 'Y-m-d'),
              type: me.context.period.type
            },
            background_layer: me.context.background_layer
          }
        });
        portalWindow = Ext.getCmp('portalWindow');
        portalWindow.setLoading('Opslaan gebruikersinstellingen');
        return Ext.Ajax.request({
          async: false,
          url: '/manager/api/context/?_accept=application/json',
          params: {
            context: context
          },
          method: 'POST',
          success: function(xhr) {
            return portalWindow.setLoading(false);
          },
          failure: function(error) {
            console.log(error);
            Ext.Msg.alert("Fout", "Fout in het opslaan van de context. Error: " + error);
            return portalWindow.setLoading(false);
          }
        });
      }
    },
    constructor: function(config) {
      var me;
      this.initConfig(config);
      this.callParent(arguments);
      this.addEvents(['contextchange']);
      me = this;
      window.onunload = this.saveContext;
      return true;
    },
    initComponent: function() {
      return this.callParent(arguments);
    }
  });

}).call(this);
