/**
 * Created by PyCharm.
 * User: bastiaanroos
 * Date: 14-11-11
 * Time: 11:36
 * To change this template use File | Settings | File Templates.
 */

Ext.define('Vss.model.AnalyseInterpretatie', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'property', type: 'string'},
        {name: 'value', type: 'auto'}
    ],

    proxy: {
        type: 'ajax',
        url: '/annotation/api/annotation/',
        extraParams: {
            _accept: 'application/json',
            _format: 'property',
            _fields: 'title,category,created_by,data_created,status'
        }
    }
});

