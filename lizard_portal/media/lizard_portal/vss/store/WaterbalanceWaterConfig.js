Ext.define('Vss.store.WaterbalanceWaterConfig', {
    extend: 'Ext.data.Store',
    requires: 'Vss.model.PropertyGrid',
    model: 'Vss.model.PropertyGrid',
    proxy: {
        type: 'ajax',
        extraParams: {
            _accept: 'application/json'
        },
        reader: {
            type: 'json'
        }
    }
});
