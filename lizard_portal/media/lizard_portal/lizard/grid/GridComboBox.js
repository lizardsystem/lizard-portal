
Ext.define('Lizard.grid.GridComboBox', {
  extend: 'Ext.form.field.ComboBox',
  alias: 'widget.gridcombobox',
  initComponent: function() {
    this.raw_object = null;
    return this.callParent(arguments);
  },
  setValue: function(value) {
    var output, rec, val, _i, _j, _len, _len2;
    if (Ext.type(value) === 'object') {
      if (value.id && value.name) {
        value = value.id;
      } else {
        this.raw_object = value.raw;
      }
    }
    if (Ext.type(value) === 'array') {
      if (value.length > 0 && value[0].name) {
        output = [];
        for (_i = 0, _len = value.length; _i < _len; _i++) {
          val = value[_i];
          output.push(val.id);
        }
        value = output;
      } else {
        output = [];
        for (_j = 0, _len2 = value.length; _j < _len2; _j++) {
          rec = value[_j];
          output.push(rec.raw);
        }
        this.raw_object = output;
      }
    }
    output = this.callParent(arguments);
    return output;
  },
  getValue: function() {
    var output;
    output = this.callParent(arguments);
    output = this.raw_object;
    return output;
  }
});
