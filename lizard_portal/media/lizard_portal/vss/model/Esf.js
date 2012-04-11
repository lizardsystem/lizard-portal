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
            {name: 'manual_value', type: 'auto'},
            {name: 'auto_value', type: 'auto'},
            {name: 'manual', type: 'int'},
            {name: 'is_manual', type: 'boolean'},
            {name: 'type', type: 'string'},
            {name: 'comment', type: 'string'},
            {name: 'config_type', type: 'string'},
            {name: 'last_edit_by', type: 'string'},
            {name: 'last_edit_date', type: 'string'},
            {name: 'iconCls', type: 'string'}
            /*,
            {name: 'qtip', mapping: 'last_comment', type: 'string'}*/]
});
