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
            encode: true,
            successProperty: 'success'
        },
        reader: {
            type: 'json',
            successProperty: 'success'
        }
    },
    constructor: function(config) {
        this.initConfig(config);
        Vss.store.Esf.superclass.constructor.apply(this);
    },
    initComponent: function(arguments) {

        Vss.store.Esf.superclass.initComponent.apply(this, arguments);
        if (!this.proxy.extraParams) {
            this.proxy.extraParams = { }
        }
        this.proxy.extraParams = Ext.merge(this.proxy.extraParams, {area_id:this.area_id });


    },
    applyParams: function(params) {
        this.proxy.extraParams = Ext.merge(this.proxy.extraParams, params);
        this.load();
    },
    listeners: {
        write: function(store, record, operation){
            store.getUpdatedRecords().forEach(function(rec) {
                if (rec.dirty === true) {
                    rec.commit();
                }
            });
            Ext.MessageBox.alert('Opslaan gelukt');
        }
    },
    rejectChanges : function(){

        Ext.each(this.removed, function(rec) {
            rec.join(this);
            this.data.add(rec);
            if(Ext.isDefined(this.snapshot)){
                this.snapshot.add(rec);
            }
        }, this);
        this.removed = [];

        this.getUpdatedRecords().forEach(function(rec) {
            if (rec.dirty === true) {
                rec.reject();
            }

            if (rec.phantom === true) {
                rec.unjoin(this);
                this.data.remove(rec);
                if(Ext.isDefined(this.snapshot)){
                    this.snapshot.remove(rec);
                }
            }
        },this);
    this.fireEvent('datachanged', this);
    }
});
