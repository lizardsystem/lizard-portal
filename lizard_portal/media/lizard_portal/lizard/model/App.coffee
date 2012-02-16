Ext.define('Lizard.model.App', {
    extend: 'Ext.data.Model',
    idProperty: 'slug',
    fields: [
        {
            name: 'slug',
            mapping: 'slug',
            type: 'text'
        },{
            name: 'name',
            mapping: 'name',
            type: 'text'
        },{
            name: 'description',
            mapping: 'description',
            type: 'text'
        },{
            name: 'type',
            mapping: 'type',
            type: 'text'
        },{
            name: 'url',
            mapping: 'url',
            type: 'text'
        }
    ],
});
