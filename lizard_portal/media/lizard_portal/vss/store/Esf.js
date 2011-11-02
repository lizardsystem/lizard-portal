/**
 * Created by PyCharm.
 * User: bastiaanroos
 * Date: 24-10-11
 * Time: 14:46
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Vss.store.Esf', {
    extend: 'Ext.data.TreeStore',
    requires: 'Vss.model.Esf',
    model: 'Vss.model.Esf',
    config: {
        area_id: null,
        constructed: false
    },
    proxy: {
        type: 'ajax',
        url: '/portal/example_treedata.json',
        params: {
            area_id: null
        }
    },
    constructor: function(config) {
        this.initConfig(config);
        Vss.store.Esf.superclass.constructor.apply(this);
    },
    initComponent: function(arguments) {

        Vss.store.Esf.superclass.initComponent.apply(this, arguments);
        if (!this.proxy.params) {
            this.proxy.params = { }
        }
        this.proxy.params = Ext.merge(this.proxy.params, {area_id:this.area_id });

    },
    applyParams: function(params) {
        this.proxy.params = Ext.merge(this.proxy.params, params);
        this.load();
    },
    setParams: function(params) {
        this.proxy.params = params;
        this.load();
    }

});