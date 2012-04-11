/**
 * @class Ext.app.PortalPanel
 * @extends Ext.Panel
 * A {@link Ext.Panel Panel} class used for providing drag-drop-enabled portal layouts.
 */

Ext.define('Lizard.portlet.PortalPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.portalpanel',
    requires: [
        'Ext.layout.component.Body'
    ],
    cls: 'x-portal',
    bodyCls: 'x-portal-body',
    defaultType: 'portalcolumn',
    componentLayout: 'body',
    autoScroll: true,
    height:'100%',

    config: {
        params: {

        }
    },
    setContext: function(params) {
        this.params = Ext.merge({}, this.params, params);
        this.fireEvent("portalcontextchange", params);
        //this.contextChange(this, new_params);
   },
    contextChange: function() {
        console.log('context change portalpanel ' + this.id);
    },
    constructor: function(config) {
        //console.log('check');
        //this.initConfig(arguments);
        //console.log('check');
        this.callParent(arguments);
    },

    initComponent : function() {
        var me = this;

        // Implement a Container beforeLayout call from the layout to this Container
        this.layout = {
            type : 'hbox',
            align: 'stretch'
        };
        //console.log('check');
        this.callParent();
        //console.log('check');
        this.addEvents({
            portalcontextchange: true,
            validatedrop: true,
            beforedragover: true,
            dragover: true,
            beforedrop: true,
            drop: true
        });
        this.on('drop', function () {
                console.log('drop do layout');
                this.doLayout();
            }, this);
        this.on('contextchange',
            this.contextChange,
            this);
        //console.log('check');
    },

    // Set columnWidth, and set first and last column classes to allow exact CSS targeting.
    beforeLayout: function() {
        var items = this.layout.getLayoutItems(),
            len = items.length,
            i = 0,
            item;

        for (; i < len; i++) {
            item = items[i];

            item.removeCls(['x-portal-column-first', 'x-portal-column-last']);
        }
        items[0].addCls('x-portal-column-first');
        items[len - 1].addCls('x-portal-column-last');
        return this.callParent(arguments);
    },

    // private
    initEvents : function(){
        this.callParent(arguments);
        this.dd = Ext.create('Lizard.portlet.PortalDropZone', this, this.dropConfig);
    },

    // private
    beforeDestroy : function() {
        if (this.dd) {
            this.dd.unreg();
        }
        this.callParent(arguments);
    },
    afterRender: function() {
        this.callParent(arguments);
        this.fireEvent("portalcontextchange", this.getParams());
    }
});

