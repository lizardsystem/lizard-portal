Ext.define('Vss.model.WaterbalanceBucket', {
    extend: 'Ext.data.Model',
    fields: [{
            name: 'id',
            mapping: 'id'
        },{
            name: 'name'
        },{
            name: 'opgedrukt'
        },{
            name: 'van'
        },{
            name: 'naar'
        },{
            name: 'ts_deb'
        }
        //TO DO, add more
    ],
    proxy: {
        type: 'ajax',
        url: '/portal/wbbuckets.json',
        extraParams: {
            _accept: 'application/json'
        },
        reader: {
            type: 'json'
        }
    }
});