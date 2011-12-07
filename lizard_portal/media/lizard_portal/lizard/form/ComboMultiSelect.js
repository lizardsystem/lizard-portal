(function() {
  Ext.define('Lizard.form.ComboMultiSelect', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.combomultiselect',
    mixins: {
      field: 'Ext.form.field.Field'
    },
    config: {
      name: '',
      field_name: 'name',
      read_at_once: false,
      combo_store: null,
      options: null
    },
    setValue: function(value) {
      var me;
      me = this;
      me.mixins.field.setValue.call(me, value);
      if (value === null || value === void 0) {
        value = '';
      }
      me.store.removeAll();
      me.store.add({
        id: 33,
        name: 'todo'
      });
      return this;
    },
    getValue: function() {
      var me, values;
      console.log('getValue');
      console.log(this.store);
      me = this;
      values = [];
      this.store.data.each(function(ref) {
        return values.push({
          id: ref.data.id,
          name: ref.data.name
        });
      });
      return Ext.JSON.encode(values);
    },
    constructor: function() {
      this.initConfig(arguments);
      this.callParent(arguments);
      return this.initField();
    },
    initComponent: function() {
      var me;
      me = this;
      this.store = Ext.create('Ext.data.Store', {
        fields: ['id', 'name'],
        proxy: {
          type: 'memory'
        }
      });
      if (this.getOptions()) {
        this.combo_store = this.getOptions();
      }
      Ext.apply(this, {
        layout: 'anchor',
        defaults: {
          anchor: '100%'
        },
        fieldDefaults: {
          msgTarget: 'under',
          labelAlign: 'top'
        },
        items: [
          {
            autoHeight: true,
            xtype: 'gridpanel',
            store: me.store,
            columns: [
              {
                text: me.getField_name(),
                dataIndex: 'name',
                flex: 1
              }, {
                xtype: 'actioncolumn',
                width: 50,
                items: [
                  {
                    icon: 'http://dev.sencha.com/deploy/ext-4.0.7-gpl/examples/shared/icons/fam/delete.gif',
                    tooltip: 'Verwijder item',
                    handler: function(grid, rowIndex, colIndex) {
                      var rec;
                      rec = grid.store.getAt(rowIndex);
                      return grid.store.remove(rec);
                    }
                  }
                ]
              }
            ],
            viewConfig: {
              plugins: {
                ptype: 'gridviewdragdrop',
                dropGroup: 'firstGridDDGroup'
              }
            }
          }, {
            xtype: 'combo',
            store: me.combo_store,
            queryMode: 'remote',
            displayField: 'name',
            valueField: 'id',
            forceSelection: true,
            typeAhead: true,
            minChars: 0,
            triggerAction: 'all',
            selectOnTab: true,
            listeners: {
              scope: me,
              'select': function(combobox, rec, scope) {
                if (this.store.indexOf(rec[0]) < 0) {
                  this.store.add(rec[0]);
                  return combobox.setValue('');
                }
              }
            }
          }
        ]
      });
      return this.callParent(arguments);
    }
  });
}).call(this);
