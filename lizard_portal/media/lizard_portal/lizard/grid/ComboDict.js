/*

Combobox fields which can handle dictionaries with valueField, DisplayField as in- and ouput

*/




Ext.define('Lizard.grid.ComboDict', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.combodict',

    return_dict: true,

    return_json: false, //otherwise an array with dicts




    setValue: function(value, doSelect) {

        var me = this,
            valueNotFoundText = me.valueNotFoundText,
            inputEl = me.inputEl,
            i, len, record,
            models = [],
            displayTplData = [],
            processedValue = [];

        if (me.store.loading) {
            // Called while the Store is loading. Ensure it is processed by the onLoad method.
            me.value = value;
            me.setHiddenValue(me.value);
            return me;
        }

        // This method processes multi-values, so ensure value is an array.
        value = Ext.Array.from(value);

        // Loop through values
        for (i = 0, len = value.length; i < len; i++) {
            record = value[i];
            if (!record || !record.isModel) {
                //translate dict input (used during initalisation in forms and grids to the default combobox input
                if (typeof(record) == 'object') {
                    record = record[me.valueField];
                }
                record = me.findRecordByValue(record);
            }
            // record found, select it.
            if (record) {
                models.push(record);
                displayTplData.push(record.data);
                processedValue.push(record.get(me.valueField));
            }
            // record was not found, this could happen because
            // store is not loaded or they set a value not in the store
            else {
                // If we are allowing insertion of values not represented in the Store, then set the value, and the display value
                if (!me.forceSelection) {
                    displayTplData.push(value[i]);
                    processedValue.push(value[i]);
                } else {
                    //Else, do the same. This is the override of the original function
                    displayTplData.push(value[i]);
                    processedValue.push(value[i]);
                }
            }
        }

        // Set the value of this field. If we are multiselecting, then that is an array.
        me.setHiddenValue(processedValue);
        me.value = me.multiSelect ? processedValue : processedValue[0];
        if (!Ext.isDefined(me.value)) {
            me.value = null;
        }
        me.displayTplData = displayTplData; //store for getDisplayValue method
        me.lastSelection = me.valueModels = models;

        if (inputEl && me.emptyText && !Ext.isEmpty(value)) {
            inputEl.removeCls(me.emptyCls);
        }

        // Calculate raw value from the collection of Model data
        me.setRawValue(me.getDisplayValue());
        me.checkChange();

        if (doSelect !== false) {
            me.syncSelection();
        }
        me.applyEmptyText();

        return me;
    },
    getSubmitValue: function(not_json) {
        if (this.return_dict) {
            if (this.return_json) {
                return Ext.JSON.encode(this.displayTplData);
            } else {
                return this.displayTplData;
            }
        } else {
            return this.getValue();
        }
    }



       
});
