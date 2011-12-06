(function() {
  Ext.define('Lizard.grid.EditableGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.leditgrid',
    config: {
      proxyUrl: '/portal/wbbuckets.json',
      proxyParams: {},
      dataConfig: [],
      useSaveBar: true,
      enterEditSummary: true,
      editable: true
    },
    extraEditors: {
      timeserie: {
        field: {
          xtype: 'combo',
          store: Ext.create('Vss.store.TimeserieObject', {
            fixedParameter: ''
          }),
          queryMode: 'remote',
          displayField: 'name',
          valueField: 'name',
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
          xtype: 'checkbox',
          step: 1
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
          step: 1
        }
      },
      number: {
        field: {
          xtype: 'numberfield',
          step: 1
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
    get_editor: function(col) {
      var editor, me, type;
      me = this;
      if (typeof col.editable === 'undefined') {
        col.editable = true;
      }
      if (!col.editable) {
        return false;
      }
      type = col.type || 'text';
      if (type) {
        if (me.extraEditors[type]) {
          editor = me.extraEditors[type];
        } else if (this.editors[type]) {
          editor = me.editors[type];
        } else if (type === 'combo') {
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
      if (value === null) {
        value = '-';
      }
      if (col.type === 'boolean') {
        if (value === true) {
          value = 'ja';
        } else if (value === false) {
          value = 'nee';
        }
      }
      if (!col.editable) {
        value = "<i>" + value + "</i>";
      }
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
      var col, col_sub, cols, cols_with_header, getColconfig, me, _i, _j, _len, _len2, _ref, _ref2;
      me = this;
      getColconfig = function(col) {
        var col_config;
        col_config = {
          text: col.title,
          width: col.width || 100,
          sortable: true,
          hidden: !col.visible,
          dataIndex: col.name,
          type: col.type,
          editable: col.editable || false,
          renderer: Ext.Function.bind(me.get_renderer, me, [col], true)
        };
        if (col.editable) {
          col_config.getEditor = Ext.Function.bind(function(record, col) {
            return me.get_editor(col);
          }, me, [col], true);
        }
        if (col.editIf) {
          col_config.editIf = col.editIf;
        }
        return col_config;
      };
      cols = [];
      _ref = this.dataConfig;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        col = _ref[_i];
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
      console.log(cols);
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
        return this.store.remove(selection);
      }
    },
    getStoreConfig: function() {
      var field, fields, store, subfield, url, _i, _j, _len, _len2, _ref, _ref2;
      fields = [];
      _ref = this.dataConfig;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        field = _ref[_i];
        if (field.columns) {
          _ref2 = field.columns;
          for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
            subfield = _ref2[_j];
            fields.push({
              name: subfield.name,
              type: subfield.type || 'auto',
              mapping: subfield.mapping || subfield.name
            });
          }
        } else {
          fields.push({
            name: field.name,
            type: field.type || 'auto',
            mapping: field.mapping || field.name
          });
        }
      }
      url = this.getProxyUrl();
      store = {
        type: 'leditstore',
        fields: fields,
        proxy: {
          type: 'ajax',
          api: {
            create: "" + url + "?action=create",
            read: url,
            update: "" + url + "?action=update",
            destroy: "" + url + "?action=delete"
          },
          extraParams: {
            _accept: 'application/json'
          },
          reader: {
            type: 'json',
            root: 'data'
          },
          writer: {
            type: 'json',
            writeAllFields: false,
            root: 'data',
            encode: true,
            successProperty: 'success'
          },
          autoLoad: true
        }
      };
      return store;
    },
    initComponent: function() {
      var me;
      me = this;
      me.columns = this.getColumnConfig();
      me.store = this.getStoreConfig();
      if (this.getEditable()) {
        this.editing = Ext.create('Ext.grid.plugin.CellEditing', {
          clicksToEdit: 1
        });
        this.plugins.push(this.editing);
        me.bbar = [
          {
            xtype: 'button',
            text: 'Toevoegen',
            iconCls: 'add',
            handler: function(menuItem, checked) {
              return me.addRecord();
            }
          }, {
            xtype: 'button',
            text: 'Delete',
            iconCls: 'add',
            handler: function(menuItem, checked) {
              return me.deleteSelectedRecord();
            }
          }
        ];
      }
      if (this.getEditable() && this.getUseSaveBar()) {
        me.bbar.concat([
          '-', {
            xtype: 'button',
            text: 'Cancel',
            iconCls: 'cancel',
            handler: function(menuItem, checked) {
              return me.cancelEdits();
            }
          }, {
            xtype: 'button',
            text: 'Save',
            iconCls: 'save',
            handler: function(menuItem) {
              if (me.getEnterEditSummary()) {
                return Ext.MessageBox.show({
                  title: 'Wijzigingen opslaan',
                  msg: 'Samenvatting',
                  width: 300,
                  multiline: true,
                  buttons: Ext.MessageBox.OKCANCEL,
                  fn: function(btn, text) {
                    if (btn === 'ok') {
                      return me.saveEdits();
                    }
                  }
                });
              } else {
                return me.saveEdits();
              }
            }
          }
        ]);
      }
      return this.callParent(arguments);
    }
  });
}).call(this);
