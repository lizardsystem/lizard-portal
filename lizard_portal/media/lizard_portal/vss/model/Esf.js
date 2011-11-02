/**
 * Created by PyCharm.
 * User: bastiaanroos
 * Date: 24-10-11
 * Time: 21:29
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Vss.model.Esf', {
    extend: 'Ext.data.Model',
    fields: [{name: 'id', type: 'auto'},
            {name: 'naam', type: 'string'},
            {name: 'bron', type: 'auto'},
            {name: 'waarde', type: 'auto'},
            {name: 'handmatig', type: 'auto'},
            {name: 'auto_waarde', type: 'string'}]
});
