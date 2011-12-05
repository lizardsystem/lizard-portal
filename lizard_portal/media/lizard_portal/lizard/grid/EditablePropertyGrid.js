(function() {
  Ext.create('Vss.store.TimeserieObject');
  Ext.define('Lizard.grid.EditablePropertyGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.leditpropgrid',
    config: {
      proxyUrl: '',
      proxyParams: {},
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
      int: {
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
    get_editor: function(record, default_editor, me) {
      var editor, type;
      if (!record.data.editable) {
        return false;
      }
      type = record.data.type;
      editor = {
        field: Ext.create('Ext.form.field.ComboBox', {
          editable: false,
          store: [[1, 'OK'], [0, 'Kritisch']]
        })
      };
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
    saveEdits: function() {
      return this.store.sync();
    },
    cancelEdits: function() {
      return this.store.rejectChanges();
    },
    constructor: function() {
      this.initConfig(arguments);
      return this.callParent(arguments);
    },
    initComponent: function() {
      var me;
      me = this;
      if (this.getEditable()) {
        this.editing = Ext.create('Ext.grid.plugin.CellEditing', {
          clicksToEdit: 1
        });
        this.plugins.push(this.editing);
      }
      if (this.getUseSaveBar()) {
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
          }
        ];
      }
      Ext.apply(this, {
        sortableColumns: false,
        hideHeaders: true,
        columns: [
          {
            text: 'Eigenschap',
            width: 200,
            sortable: true,
            dataIndex: 'property'
          }, {
            text: 'Waarde',
            flex: 1,
            sortable: true,
            dataIndex: 'value',
            renderer: me.get_renderer,
            getEditor: function(record, default_editor) {
              return me.get_editor(record, default_editor, me);
            },
            field: {
              allowBlank: false
            }
          }
        ],
        store: {
          type: 'leditstore',
          fields: [
            {
              name: 'id',
              mapping: 'id'
            }, {
              name: 'property',
              mapping: 'property'
            }, {
              name: 'value',
              mapping: 'value',
              type: 'auto',
              defaultValue: null
            }, {
              name: 'type',
              mapping: 'type',
              type: 'text',
              defaultValue: 'text'
            }, {
              name: 'editable',
              mapping: 'editable',
              defaultValue: true
            }
          ],
          proxy: {
            type: 'ajax',
            url: this.getProxyUrl(),
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
            }
          }
        }
      });
      return this.callParent(arguments);
    }
  });
}).call(this);
