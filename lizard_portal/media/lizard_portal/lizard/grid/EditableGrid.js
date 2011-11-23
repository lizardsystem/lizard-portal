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
    constructor: function() {
      this.initConfig(arguments);
      return this.callParent(arguments);
    },
    getColumnConfig: function() {
      var col, cols, _i, _len, _ref;
      cols = [];
      _ref = this.dataConfig;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        col = _ref[_i];
        cols.push({
          text: col.title,
          width: col.width || 100,
          sortable: true,
          visible: col.visible,
          dataIndex: col.name,
          field: {
            allowBlank: false
          }
        });
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
      var field, fields, store, _i, _len, _ref;
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
      store = {
        type: 'leditstore',
        fields: fields,
        proxy: {
          type: 'ajax',
          url: this.getProxyUrl(),
          extraParams: {
            _accept: 'application/json'
          },
          reader: {
            type: 'json'
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
