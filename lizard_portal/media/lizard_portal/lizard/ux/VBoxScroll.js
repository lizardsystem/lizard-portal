/**
 * Created by PyCharm.
 * User: bastiaanroos
 * Date: 5-11-11
 * Time: 12:49
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Lizard.ux.VBoxScroll',{
    alias: 'layout.vboxscroll',
    extend: 'Ext.layout.container.VBox',
    innerCls: 'l-box-inner-scroll',

    initOverflowHandler: function() {
        var handler = this.overflowHandler;
        var handler = 'Scroller';

        if (typeof handler == 'string') {
            handler = {
                type: handler
            };
        }

        var handlerType = 'None';
        if (handler && handler.type !== undefined) {
            handlerType = handler.type;
        }

        var constructor = Ext.layout.container.boxOverflow[handlerType];
        if (constructor[this.type]) {
            constructor = constructor[this.type];
        }

        this.overflowHandler = Ext.create('Ext.layout.container.boxOverflow.' + handlerType, this, handler);
    }
});