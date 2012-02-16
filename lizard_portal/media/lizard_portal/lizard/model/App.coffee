
Ext.define('Lizard.model.App', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            mapping: 'id',
            type: 'text'
        },{
            name: 'order',
            mapping: 'order',
            type: 'int',
            defaultValue:10
        },{
            name: 'name',
            mapping: 'name',
            type: 'text'
        },{
            name: 'description',
            mapping: 'description',
            type: 'text'
        },{
            name: 'icon_url',
            mapping: 'icon_url',
            type: 'text'
        }
    ]
});
