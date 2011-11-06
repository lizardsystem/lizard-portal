/**
 * Created by PyCharm.
 * User: bastiaanroos
 * Date: 24-10-11
 * Time: 21:29
 * To change this template use File | Settings | File Templates.
 */

Ext.define('Vss.model.Esf', {
    extend: 'Ext.data.Model',
    fields: [{name: 'id', mapping: 'id', type: 'auto'},
            {name: 'config_id', type: 'auto'},
            {name: 'name', type: 'string'},
            {name: 'source_name', type: 'auto'},
            {name: 'manual_value', type: 'float', default_value: -1},
            {name: 'manual', type: 'int', default_value: -1},
            {name: 'auto_value', type: 'string', default_value: '-'},
            {name: 'type', type: 'string'}/*,
            {name: 'qtip', mapping: 'last_comment', type: 'string'}*/]
});
