
Ext.define('Vss.model.PropertyGrid', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            mapping: 'id'
        },{
            name: 'property',
            mapping: 'property'
        },{
            name: 'value',
            mapping: 'value',
            defaultValue: '-'
        },{
            name: 'type',
            mapping: 'type',
            defaultValue: 'text'
        }
    ]
});