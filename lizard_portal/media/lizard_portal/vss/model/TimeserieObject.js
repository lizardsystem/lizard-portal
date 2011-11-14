
Ext.define('Vss.model.TimeserieObject', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            mapping: 'id',
            type: 'text'
        },{
            name: 'name',
            mapping: 'name',
            type: 'text'
        },{
            name: 'location',
            mapping: 'location',
            type: 'text'
        },{
            name: 'parameter',
            mapping: 'parameter',
            type: 'text'
        }
    ]
});