/**
 * Created by PyCharm.
 * User: bastiaanroos
 * Date: 24-10-11
 * Time: 21:40
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Vss.model.ObjectTree', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            mapping: 'id'
        },{
            name: 'text',
            mapping: 'name'
        },{
            name: 'leaf',
            mapping: 'leaf',
            defaultValue: false
        },{
            name: 'internalId',
            mapping: 'parent'
        }
    ],

    proxy: {
        type: 'rest',
        url: '/area/api/catchment-areas/',
        extraParams: {
            _accept: 'application/json'
        },
        reader: {
            type: 'json',
            root: 'areas'
        }
    }
});

