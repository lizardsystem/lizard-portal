Ext.define('Vss.store.TimeserieObject', {
    extend: 'Ext.data.Store',
    requires: 'Vss.model.TimeserieObject',
    model: 'Vss.model.TimeserieObject',
    //storeId: 'timeserieobject',
    proxy: {
        type: 'ajax',
        url: '/fewsnorm/api/timeserieselection/',
        extraParams: {
            _accept: 'application/json'
        },
        autoLoad: false,
        remoteFilter: true,
        reader: {
            root: 'data',
            type: 'json',
            totalProperty: 'total'
        }
    },
    constructor: function() {
        this.initConfig(arguments);
        this.callParent(arguments);
        if (this.fixedParameter) {
            this.proxy.extraParams.fixedParameter = this.fixedParameter;
        }

    }
});