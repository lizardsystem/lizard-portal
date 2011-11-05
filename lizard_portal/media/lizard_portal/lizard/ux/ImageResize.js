/**
 * Created by PyCharm.
 * User: bastiaanroos
 * Date: 5-11-11
 * Time: 13:21
 * To change this template use File | Settings | File Templates.
 */

Ext.define('Lizard.ux.ImageResize', {
    extend: 'Ext.Img',
    alias: 'widget.imageResize',
    config: {
        class_checked: 'grid-checkheader-checked',
        class_unchecked: 'grid-checkheader-unchecked',
        class_null: 'grid-checkheader-null'
    },

    setParams: function(params) {
        self.setSrc();
    },

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
            this.fireEvent('checkchange', this, recordIndex, checked);
            // cancel selection.
            return false;
        } else {
            return this.callParent(arguments);
        }
    },

    // Note: class names are not placed on the prototype bc renderer scope
    // is not in the header.
    renderer : function(value){
        var cssPrefix = Ext.baseCSSPrefix;
        var cls = [cssPrefix + 'grid-checkheader'];

        if (value) {
            cls.push(cssPrefix + 'grid-checkheader-checked');
        } else if (value===false) {
            cls.push(cssPrefix + 'grid-checkheader-unchecked');
        } else if (value===null){
            cls.push(cssPrefix + 'grid-checkheader-null');
        }

        return '<div class="' + cls.join(' ') + '">&#160;</div>';
    }
});
