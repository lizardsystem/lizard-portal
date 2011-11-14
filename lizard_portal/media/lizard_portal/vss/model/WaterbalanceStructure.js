Ext.define('Vss.model.WaterbalanceStructure', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            mapping: 'id'
        },{
            name: 'code',
            mapping: 'code'
        },{
            name: 'name',
            mapping: 'name'
        }//TO DO, add more
    ],
    proxy: {
        type: 'ajax',
        url: '/portal/wbstructures.json',
        extraParams: {
            _accept: 'application/json'
        },
        reader: {
            type: 'json'
        }
    }
});