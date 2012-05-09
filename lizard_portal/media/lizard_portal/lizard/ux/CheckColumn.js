/*
 *
 * In addition to toggling a Boolean value within the record data, this
 * class adds or removes a css class <tt>'x-grid-checked'</tt> on the td
 * based on whether or not it is checked to alter the background image used
 * for a column.
 */
Ext.define('Lizard.ux.CheckColumn', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.checkcolumn',
    class_base: 'grid-checkheader',
    class_true: 'grid-checkheader-checked',
    class_false: 'grid-checkheader-unchecked',
    class_null: 'grid-checkheader-null',
    constructor: function(config) {
        //this.initConfig(config);
        this.addEvents(
            /**
             * @event checkchange
             * Fires when the checked state of a row changes
             * @param {Ext.ux.CheckColumn} this
             * @param {Number} rowIndex The row index
             * @param {Boolean} checked True if the box is checked
             */
            'checkchange'
        );

        var me = this;

        this.renderer = function(value){
            var cssPrefix = Ext.baseCSSPrefix;
            var cls = [cssPrefix + me.class_base];

            if (value) {
                cls.push(cssPrefix + me.class_true);
            } else if (value===false) {
                cls.push(cssPrefix + me.class_false);
            } else if (value===null){
                cls.push(cssPrefix + me.class_null);
            }

            return '<div class="' + cls.join(' ') + '">&#160;</div>';
        }
        this.callParent(arguments);
    },
    /**
     * @private
     * Process and refire events routed from the GridView's processEvent method.
     */
    processEvent: function(type, view, cell, recordIndex, cellIndex, e) {

        if (type == 'mousedown' || (type == 'keydown' && (e.getKey() == e.ENTER || e.getKey() == e.SPACE))) {
            
            var record = view.panel.store.getAt(recordIndex);
            var dataIndex = this.dataIndex;
            var checked = !record.get(dataIndex);
                
            record.set(dataIndex, checked);
            this.fireEvent('checkchange', this, record, dataIndex, checked);
            this.onCheckChange(this, record, dataIndex, checked);
            // cancel selection.
            return false;
        } else {
            return this.callParent(arguments);
        }
    },
    onCheckChange: function() {
        //overwrite this function
    }
});


