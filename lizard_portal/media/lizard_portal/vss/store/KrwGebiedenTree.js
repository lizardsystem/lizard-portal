/**
 * Created by PyCharm.
 * User: bastiaanroos
 * Date: 24-10-11
 * Time: 22:00
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Vss.store.KrwGebiedenTree', {
    extend: 'Ext.data.TreeStore',
    requires: 'Vss.model.ObjectTree',
    model: 'Vss.model.ObjectTree',
    root: {
        text: 'KRW waterlichamen'
    },
    proxy: {
        type: 'rest',
        url: '/area/api/krw-areas/',
        extraParams: {
            _accept: 'application/json'
        },
        reader: {
            type: 'json',
            root: 'areas'
        }
    }
});