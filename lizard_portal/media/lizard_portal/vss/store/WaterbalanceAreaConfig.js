Ext.define('Vss.store.WaterbalanceAreaConfig', {
    extend: 'Ext.data.Store',
    requires: 'Vss.model.PropertyGrid',
    model: 'Vss.model.PropertyGrid',
    proxy: {
        type: 'ajax',
        url: '/wbconfiguration/api/area_configuration/',
        extraParams: {
            _accept: 'application/json'
        },
        reader: {
            type: 'json'
        }
    },
});
