(function() {
  Ext.define('Lizard.store.EditGridStore', {
    extend: 'Ext.data.Store',
    alias: 'store.leditstore',
    config: {
      something: false
    },
    applyParams: function(params) {
      this.proxy.extraParams = Ext.merge(this.proxy.extraParams, params);
      return this.load();
    },
    rejectChanges: function() {
      Ext.each(this.removed, function(rec) {
        rec.join(this);
        this.data.add(rec);
        if (Ext.isDefined(this.snapshot)) {
          return this.snapshot.add(rec);
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
          if (Ext.isDefined(this.snapshot)) {
            return this.snapshot.remove(rec);
          }
        }
      }, this);
      this.getNewRecords().forEach(function(rec) {
        return this.data.remove(rec);
      }, this);
      return this.fireEvent('datachanged', this);
    },
    constructor: function() {
      this.initConfig(arguments);
      return this.callParent(arguments);
    },
    initComponent: function() {
      var me;
      me = this;
      Ext.apply(this({
        idProperty: 'id'
      }));
      this.callParent(arguments);
      return this;
    },
    listeners: {
      write: function(store, record, operation) {
        store.getUpdatedRecords().forEach(function(rec) {
          if (rec.dirty === true) {
            return rec.commit();
          }
        });
        return Ext.MessageBox.alert('Opslaan gelukt');
      }
    }
  });
}).call(this);
