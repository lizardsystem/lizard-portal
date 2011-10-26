/**
 * Created by PyCharm.
 * User: bastiaanroos
 * Date: 24-10-11
 * Time: 14:43
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Vss.store.Maplayer', {
    extend: 'Ext.data.Store',
    requires: 'Vss.model.Maplayer',
    model: 'Vss.model.Maplayer'
});