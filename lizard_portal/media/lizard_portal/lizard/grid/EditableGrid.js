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
          store: 'timeserieobject',
          queryMode: 'remote',
          displayField: 'name',
          valueField: 'name',
          forceSelection: true,
          typeAhead: true,
          minChars: 0,
          triggerAction: 'all',
          selectOnTab: true
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
      console.log(col);
      if (typeof col.editable === 'undefined') {
        col.editable = true;
      }
      if (!col.editable) {
        console.log;
        return false;
      }
      type = col.type || 'text';
      if (type) {
        if (me.extraEditors[type]) {
          editor = me.extraEditors[type];
        } else if (this.editors[type]) {
          editor = me.editors[type];
        }
      }
      if (Ext.type(editor) === 'object') {
        return Ext.create('Ext.grid.CellEditor', editor);
      } else {
        return editor;
      }
    },
    get_renderer: function(value, metaData, record) {
      if (value === null) {
        value = '-';
      }
      if (record.data.type === 'boolean') {
        if (value === true) {
          value = 'ja';
        } else if (value === false) {
          value = 'nee';
        }
      }
      if (!record.data.editable) {
        value = "<i>" + value + "</i>";
      }
      return value;
    },
    constructor: function() {
      this.initConfig(arguments);
      return this.callParent(arguments);
    },
    getColumnConfig: function() {
      var col, col_config, cols, _i, _len, _ref;
      cols = [];
      _ref = this.dataConfig;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        col = _ref[_i];
        col_config = {
          text: col.title,
          width: col.width || 100,
          sortable: true,
          hidden: !col.visible,
          dataIndex: col.name
        };
        if (this.get_editor(col)) {
          col_config.field = this.get_editor(col);
        }
        console.log(col_config);
        cols.push(col_config);
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
      var edit, rec;
      rec = {
        first: '',
        last: '',
        email: ''
      };
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
      var field, fields, store, url, _i, _len, _ref;
      fields = [];
      _ref = this.dataConfig;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        field = _ref[_i];
        fields.push({
          name: field.name,
          type: field.type || 'auto',
          mapping: field.mapping || field.name
        });
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
      if (this.getEditable) {
        this.editing = Ext.create('Ext.grid.plugin.CellEditing', {
          clicksToEdit: 1
        });
        this.plugins.push(this.editing);
      }
      if (this.getUseSaveBar) {
        me.bbar = [
          {
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
          }, '-', {
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
      return this.callParent(arguments);
    }
  });
}).call(this);
