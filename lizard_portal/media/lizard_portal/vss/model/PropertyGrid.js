
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
            type: 'auto',
            defaultValue: null
        },{
            name: 'type',
            mapping: 'type',
            defaultValue: 'text'
        },{
            name: 'editable',
            mapping: 'editable',
            defaultValue: true
        }
    ]
});