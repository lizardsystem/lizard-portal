/**
 * Created by PyCharm.
 * User: bastiaanroos
 * Date: 24-10-11
 * Time: 14:46
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Vss.store.Esf', {
    extend: 'Ext.data.Store',
    requires: 'Vss.model.Esf',
    model: 'Vss.model.Esf'
});