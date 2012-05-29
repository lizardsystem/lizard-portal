

Ext.define('Vss.store.EsfHistory', {
    extend: 'Ext.data.TreeStore',
    requires: 'Vss.model.Esf',
    model: 'Vss.model.Esf',
    autoLoad: false,
    indexOf: Ext.emptyFn,
    config: {
        area_id: null,
        constructed: false,
        extraParams: {}
    },
    proxy: {
        type: 'ajax',
        url: '/esf/api/configuration/tree/',
        extraParams: {
        },
        writer: {
            type: 'json',
            writeAllFields: false,
            root: 'data',
            successProperty: 'success',
            encode:true
        },
        reader: {
            type: 'json',
            successProperty: 'success'
        },
        afterRequest:function(request,success){
            if (request.method == 'POST') {
                if (success) {
                    Ext.MessageBox.alert('Opslaan gelukt');
                } else {
                    Ext.MessageBox.alert('Opslaan mislukt');
                }
            }
        }
    },
    constructor: function(config) {
        this.initConfig(config);
        this.callParent(arguments);
    },
    applyParams: function(params) {
        this.proxy.extraParams = Ext.merge(this.proxy.extraParams, params);
        this.load();
    }
});
