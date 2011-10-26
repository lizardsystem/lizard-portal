/**
 * Created by PyCharm.
 * User: bastiaanroos
 * Date: 24-10-11
 * Time: 21:30
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Vss.store.Communique', {
    extend: 'Ext.data.Store',
    requires: 'Vss.model.Communique',
    model: 'Vss.model.Communique'
});