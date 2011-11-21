(function() {
  Ext.define('Lizard.grid.EditableGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.leditgrid',
    config: {
      proxyUrl: '/portal/wbbuckets.json',
      proxyParams: {},
      dataConfig: [],
      useSaveBar: true,
      enterEditSummary: true
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
    save: function() {
      return this.store.sync();
    },
    cancel: function() {
      return this.store.rejectChanges();
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
      if (this.getUseSaveBar) {
        me.bbar = [
          {
            xtype: 'button',
            text: 'Cancel',
            iconCls: 'cancel',
            handler: function(menuItem, checked) {
              return me.cancel();
            }
          }, {
            xtype: 'button',
            id: 'save_button',
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
                      return me.save();
                    }
                  }
                });
              } else {
                return me.save();
              }
            }
          }
        ];
      }
      return this.callParent(arguments);
    }
  });
}).call(this);
