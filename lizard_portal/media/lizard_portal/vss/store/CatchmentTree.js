/**
 * Created by PyCharm.
 * User: bastiaanroos
 * Date: 24-10-11
 * Time: 21:42
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Vss.store.CatchmentTree', {
    extend: 'Ext.data.TreeStore',
    requires: 'Vss.model.ObjectTree',
    model: 'Vss.model.ObjectTree',
    root: {
        text: 'krw gebieden',
        id: 'root'
    }
});