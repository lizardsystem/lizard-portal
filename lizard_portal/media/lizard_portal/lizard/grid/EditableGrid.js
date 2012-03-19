
/*
    Fields:






    * combo:
        choices:
            * array with string choices; or
            * array with objects of choices. the objects has a 'id' and 'name' key






  issues:
  - editors are to small
  - multiselect comboboxes doesn't work correct
*/

(function() {

  Ext.override(Ext.form.field.Field, {
    isEqual: function(a, b) {
      if (Ext.isDate(a) && Ext.isDate(b)) {
        return a.getTime() === b.getTime();
      } else if (Ext.isObject(a) && Ext.isObject(b)) {
        return a.id === b.id;
      } else if (Ext.isArray(a) && Ext.isArray(b)) {
        console.log(a);
        console.log(b);
        if (a.length === 1 && b.length === 1) {
          console.log(a[0].id === b[0].id);
          return a[0].id === b[0].id;
        }
      }
      return a === b;
    }
  });

  Ext.override(Ext.data.Model, {
    isEqual: function(a, b) {
      if (Ext.isDate(a) && Ext.isDate(b)) {
        return a.getTime() === b.getTime();
      } else if (Ext.isObject(a) && Ext.isObject(b)) {
        return a.id === b.id;
      } else if (Ext.isArray(a) && Ext.isArray(b)) {
        if (a.length === 1 && b.length === 1) {
          console.log(a[0].id === b[0].id);
          return a[0].id === b[0].id;
        }
      }
      return a === b;
    }
  });

  Ext.define('Lizard.grid.EditableGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.leditgrid',
    requires: ['Lizard.window.EditSummaryBox'],
    config: {
      proxyUrl: '',
      proxyParams: {},
      dataConfig: [],
      storeAutoLoad: false,
      useSaveBar: true,
      useAddDeleteButtons: true,
      enterEditSummary: true,
      editable: true,
      addEditIcon: false,
      addDeleteIcon: false,
      actionEditIcon: null,
      actionDeleteIcon: null,
      extraActionIcon: true,
      extraActionIconUrl: true,
      extraActionIconTooltip: '-',
      actionExtraActionIcon: null,
      usePagination: true,
      read_only_field: null,
      recordsPerPage: 25
    },
    extraEditors: {
      timeserie: {
        editor: {
          xtype: 'combo',
          store: Ext.create('Vss.store.TimeserieObject', {
            fixedParameter: ''
          }),
          queryMode: 'remote',
          displayField: 'name',
          valueField: 'id',
          forceSelection: true,
          typeAhead: true,
          minChars: 0,
          triggerAction: 'all',
          selectOnTab: true,
          pageSize: 15,
          width: 150,
          size: 150
        }
      }
    },
    editors: {
      text: {
        field: {
          xtype: 'textfield'
        }
      },
      oordeel: {
        field: Ext.create('Ext.form.field.ComboBox', {
          editable: false,
          store: [[1, 'OK'], [0, 'Kritisch']]
        })
      },
      boolean: {
        field: {
          xtype: 'checkbox'
        }
      },
      checkbox: {
        field: {
          xtype: 'checkbox',
          step: 1
        }
      },
      float: {
        field: {
          xtype: 'numberfield',
          step: 1,
          allowDecimals: true
        }
      },
      number: {
        field: {
          xtype: 'numberfield',
          step: 1,
          allowDecimals: false
        }
      },
      date: {
        field: {
          xtype: 'datefield',
          format: 'm d Y',
          altFormats: 'd,m,Y|d.m.Y'
        }
      }
    },
    get_editor: function(record, col) {
      var editor, me, type;
      me = this;
      if (me.read_only_field && record.data[me.read_only_field] === true) {
        return false;
      }
      if (typeof col.editable === 'undefined') col.editable = true;
      if (!col.editable) return false;
      type = col.type || 'text';
      if (type) {
        if (me.extraEditors[type]) {
          editor = me.extraEditors[type];
        } else if (this.editors[type]) {
          editor = me.editors[type];
        } else if (type === 'combo') {
          if (col.choices && col.choices.length > 0 && Ext.type(col.choices[0]) === 'object') {
            console.log('combodict');
            editor = {
              field: {
                xtype: 'combodict',
                displayField: 'name',
                valueField: 'id',
                return_json: false,
                store: {
                  fields: ['id', 'name'],
                  data: col.choices
                },
                queryMode: 'local',
                multiSelect: col.multiSelect || false,
                forceSelection: true,
                triggerAction: 'all',
                selectOnTab: true
              }
            };
          } else if (col.remote) {
            console.log('gridcombobox');
            editor = {
              field: {
                xtype: 'gridcombobox',
                store: col.store,
                queryMode: 'remote',
                displayField: 'name',
                valueField: 'id',
                return_json: false,
                forceSelection: true,
                typeAhead: true,
                minChars: 0,
                triggerAction: 'all',
                selectOnTab: true,
                pageSize: 15,
                width: 150,
                size: 150
              }
            };
          } else {
            console.log('combo');
            editor = {
              field: {
                xtype: 'combo',
                store: col.choices,
                queryMode: 'local',
                forceSelection: true,
                triggerAction: 'all',
                selectOnTab: true
              }
            };
          }
        } else if (type === 'gridcombobox') {
          if (col.remote) {
            editor = {
              field: {
                xtype: 'gridcombobox',
                store: col.store,
                queryMode: 'remote',
                displayField: 'name',
                valueField: 'id',
                forceSelection: true,
                typeAhead: true,
                minChars: 0,
                triggerAction: 'all',
                selectOnTab: true,
                pageSize: 15,
                width: 150,
                size: 150
              }
            };
          } else {
            editor = {
              field: {
                xtype: 'gridcombobox',
                displayField: 'name',
                valueField: 'id',
                store: {
                  fields: ['id', 'name'],
                  data: col.choices
                },
                queryMode: 'local',
                forceSelection: true,
                triggerAction: 'all',
                selectOnTab: true,
                multiSelect: col.multiSelect
              }
            };
          }
        }
      }
      if (Ext.type(editor) === 'object') {
        editor = Ext.create('Ext.grid.CellEditor', editor);
        if (type === 'timeserie' && col.ts_parameter) {
          editor.field.store = Ext.create('Vss.store.TimeserieObject', {
            fixedParameter: col.ts_parameter
          });
        }
        return editor;
      } else {
        return editor;
      }
    },
    get_renderer: function(value, style, record, rownr, colnr, store, gridpanel, col) {
      var list_choices, names, val, _i, _len, _ref;
      if (value === null) {
        value = '-';
      } else if (col.type === 'boolean') {
        if (value === true) {
          value = 'ja';
        } else if (value === false) {
          value = 'nee';
        }
      } else if ((_ref = col.type) === 'combo' || _ref === 'gridcombobox') {
        if (Ext.type(value) === 'object') {
          value = value.name;
        } else if (Ext.type(value) === 'array') {
          names = [];
          for (_i = 0, _len = value.length; _i < _len; _i++) {
            val = value[_i];
            names.push(val.name);
          }
          value = names.join(',<br>');
        } else if (col.choices) {
          list_choices = Ext.Array.filter(col.choices, function(val) {
            if (val.id === value) return true;
          });
          if (list_choices.length > 0) value = list_choices[0].name;
        }
      }
      if (!col.editable) value = "<i>" + value + "</i>";
      if (col.editIf) {
        if (!Ext.Array.contains(col.editIf.value_in, record.data[col.editIf.prop])) {
          console.log('grijs');
          value = "<span style='color:#888;'>" + value + "</span>";
        }
      }
      return value;
    },
    constructor: function() {
      this.initConfig(arguments);
      return this.callParent(arguments);
    },
    getColumnConfig: function() {
      var col, colConfig, col_sub, cols, cols_with_header, getColconfig, me, _i, _j, _len, _len2, _ref, _ref2;
      me = this;
      getColconfig = function(col) {
        var col_config;
        if (typeof col.sortable === 'undefined') col.sortable = true;
        col_config = {
          text: col.title,
          width: col.width || 100,
          sortable: col.sortable,
          hidden: !col.visible,
          dataIndex: col.name,
          type: col.type,
          editable: col.editable || false,
          renderer: Ext.Function.bind(me.get_renderer, me, [col], true)
        };
        if (col.editable) {
          col_config.getEditor = Ext.Function.bind(function(record, col) {
            return me.get_editor(record, col);
          }, me, [col], true);
        }
        if (col.editIf) col_config.editIf = col.editIf;
        if (col.multiSelect) col_config.multiSelect = true;
        return col_config;
      };
      cols = [];
      if (this.addEditIcon || this.addDeleteIcon || this.addExtraActionIcon) {
        colConfig = {
          xtype: 'actioncolumn',
          width: 50,
          items: []
        };
        if (this.addEditIcon) {
          colConfig.items.push({
            icon: '/static_media/lizard_portal/images/settingtable.png',
            tooltip: 'Edit',
            handler: function(grid, rowIndex, colIndex) {
              var rec;
              rec = grid.getStore().getAt(rowIndex);
              if (me.read_only_field && rec.data[me.read_only_field] === true) {
                return Ext.Msg.alert('melding', 'Dit record is read only.');
              } else {
                if (me.actionEditIcon) {
                  return me.actionEditIcon(rec);
                } else {
                  return alert("Edit " + rec.get('id'));
                }
              }
            }
          });
        }
        if (this.addDeleteIcon) {
          colConfig.items.push({
            icon: '/static_media/lizard_portal/images/delete.png',
            tooltip: 'Delete',
            handler: function(grid, rowIndex, colIndex) {
              var rec;
              rec = grid.getStore().getAt(rowIndex);
              if (me.read_only_field && rec.data[me.read_only_field] === true) {
                return Ext.Msg.alert('melding', 'Dit record is read only.');
              } else {
                return me.store.remove(rec);
              }
            }
          });
        }
        if (this.addExtraActionIcon) {
          colConfig.items.push({
            icon: this.extraActionIconUrl,
            tooltip: this.extraActionIconTooltip,
            handler: function(grid, rowIndex, colIndex) {
              var rec;
              rec = grid.getStore().getAt(rowIndex);
              return me.actionExtraActionIcon(rec);
            }
          });
        }
        cols.push(colConfig);
      }
      _ref = this.dataConfig;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        col = _ref[_i];
        if (!col.only_store) {
          if (!col.columns) {
            cols.push(getColconfig(col));
          } else {
            cols_with_header = {
              text: col.title,
              columns: []
            };
            _ref2 = col['columns'];
            for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
              col_sub = _ref2[_j];
              cols_with_header['columns'].push(getColconfig(col_sub));
            }
            cols.push(cols_with_header);
          }
        }
      }
      return cols;
    },
    saveEdits: function() {
      return this.store.sync();
    },
    cancelEdits: function() {
      return this.store.rejectChanges();
    },
    addRecord: function() {
      var edit;
      this.store.insert(0, {});
      if (this.editing) {
        edit = this.editing;
        edit.cancelEdit();
        return edit.startEditByPosition({
          row: 0,
          column: 1
        });
      }
    },
    deleteSelectedRecord: function() {
      var selection;
      selection = this.getView().getSelectionModel().getSelection()[0];
      if (selection) {
        if (this.read_only_field && selection.data[this.read_only_field] === true) {
          return false;
        } else {
          return this.store.remove(selection);
        }
      }
    },
    getStoreConfig: function() {
      var field, fields, getGridFieldSettings, params, proxyparams, store, subfield, url, _i, _j, _len, _len2, _ref, _ref2;
      fields = [];
      getGridFieldSettings = function(setting) {
        var field, _ref;
        field = {
          name: setting.name,
          type: setting.type || 'auto',
          mapping: setting.mapping || setting.name
        };
        if (setting.defaultValue) field['defaultValue'] = setting.defaultValue;
        if ((_ref = setting.type) === 'combo' || _ref === 'gridcombo') {
          field.sortType = 'asIdNameObject';
        }
        return field;
      };
      _ref = this.dataConfig;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        field = _ref[_i];
        if (field.columns) {
          _ref2 = field.columns;
          for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
            subfield = _ref2[_j];
            fields.push(getGridFieldSettings(subfield));
          }
        } else {
          fields.push(getGridFieldSettings(field));
        }
      }
      if (this.store) {
        this.store.fields = fields;
        return this.store;
      }
      url = this.getProxyUrl();
      params = [];
      proxyparams = this.getProxyParams();
      Ext.Object.each(this.getProxyParams(), function(key, value) {
        params.push(key + '=' + value);
        return console.log(params);
      });
      params = params.join('&');
      store = {
        type: 'leditstore',
        fields: fields,
        pageSize: this.recordsPerPage,
        remoteFilter: true,
        proxy: {
          type: 'ajax',
          api: {
            create: "" + url + "?_accept=application/json&flat=false&action=create&" + params,
            read: "" + url + "?_accept=application/json&" + params,
            update: "" + url + "?_accept=application/json&flat=false&action=update&" + params,
            destroy: "" + url + "?_accept=application/json&flat=false&action=delete&" + params
          },
          extraParams: {},
          reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'count'
          },
          writer: {
            type: 'json',
            writeAllFields: false,
            root: 'data',
            encode: true,
            successProperty: 'success',
            totalProperty: 'count'
          }
        }
      };
      return store;
    },
    initComponent: function() {
      var me;
      me = this;
      if (!this.getUsePagination()) this.recordsPerPage = 10000;
      me.columns = this.getColumnConfig();
      me.store = Ext.create('Lizard.store.EditGridStore', this.getStoreConfig());
      me.bbar = [];
      me.bbar = [];
      if (this.getEditable()) {
        this.editing = Ext.create('Lizard.grid.CellEditing', {
          clicksToEdit: 1
        });
        if (!this.plugins) this.plugins = [];
        this.plugins.push(this.editing);
        if (this.useAddDeleteButtons) {
          me.bbar = me.bbar.concat([
            {
              xtype: 'button',
              text: 'Toevoegen',
              iconCls: 'l-icon-add',
              handler: function(menuItem, checked) {
                return me.addRecord();
              }
            }, {
              xtype: 'button',
              text: 'Delete',
              iconCls: 'l-icon-delete',
              handler: function(menuItem, checked) {
                return me.deleteSelectedRecord();
              }
            }
          ]);
        }
      }
      if (this.getEditable() && this.getUseSaveBar()) {
        me.bbar = me.bbar.concat([
          '-', {
            xtype: 'button',
            text: 'Cancel',
            iconCls: 'l-icon-cancel',
            handler: function(menuItem, checked) {
              return me.cancelEdits();
            }
          }, {
            xtype: 'button',
            text: 'Save',
            iconCls: 'l-icon-disk',
            handler: function(menuItem) {
              if (me.getEnterEditSummary()) {
                return Lizard.window.EditSummaryBox.show({
                  fn: function(btn, text, field) {
                    if (btn === 'ok') {
                      me.store.setTempWriteParams({
                        edit_message: text
                      });
                      me.saveEdits();
                    }
                    return true;
                  }
                });
              } else {
                return me.saveEdits();
              }
            }
          }
        ]);
      }
      if (this.getUsePagination()) {
        this.bbar = {
          xtype: 'pagingtoolbar',
          pageSize: this.recordsPerPage,
          store: me.store,
          displayInfo: true,
          items: ['-'].concat(me.bbar)
        };
      }
      return this.callParent(arguments);
    },
    afterRender: function() {
      if (this.storeAutoLoad) return this.store.load();
    }
  });

}).call(this);
