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
      options: null,
      extra_fields: null,
      editable: false,
      plugins: []
    },
    setValue: function(value) {
      var me, v, _i, _len;
      me = this;
      me.mixins.field.setValue.call(me, value);
      if (Ext.type(value) === 'array') {
        for (_i = 0, _len = value.length; _i < _len; _i++) {
          v = value[_i];
          this.store.add(v);
        }
      } else if (Ext.type(value) === 'object') {
        this.store.add(value);
      }
      return this;
    },
    getValue: function(jsonFormat) {
      var me, values;
      if (jsonFormat == null) jsonFormat = false;
      me = this;
      values = [];
      this.store.data.each(function(ref) {
        return values.push(ref.data);
      });
      if (jsonFormat) return Ext.JSON.encode(values);
      return values;
    },
    getSubmitValue: function() {
      return this.getValue();
    },
    getSubmitData: function() {
      var data;
      data = {};
      data[this.name] = this.getValue();
      return data;
    },
    constructor: function() {
      this.initConfig(arguments);
      this.callParent(arguments);
      return this.initField();
    },
    initComponent: function() {
      var extra_field, fields, me, plugins, _i, _len, _ref;
      me = this;
      this.store = Ext.create('Ext.data.Store', {
        fields: ['id', 'name'],
        proxy: {
          type: 'memory'
        }
      });
      if (this.getOptions()) this.combo_store = this.getOptions();
      fields = [
        {
          text: me.getField_name(),
          dataIndex: 'name',
          flex: 1
        }
      ];
      if (me.extra_fields) {
        _ref = me.extra_fields;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          extra_field = _ref[_i];
          fields.push(extra_field);
        }
      }
      fields.push({
        xtype: 'actioncolumn',
        width: 50,
        items: [
          {
            icon: '/static_media/lizard_portal/images/delete.png',
            tooltip: 'Verwijder item',
            handler: function(grid, rowIndex, colIndex) {
              var rec;
              rec = grid.store.getAt(rowIndex);
              return grid.store.remove(rec);
            }
          }
        ]
      });
      if (this.getEditable()) {
        plugins = [
          Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
          })
        ];
      } else {
        plugins = [];
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
            columns: fields,
            plugins: plugins
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
