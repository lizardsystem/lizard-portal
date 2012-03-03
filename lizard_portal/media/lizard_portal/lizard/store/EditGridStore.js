
Ext.apply(Ext.data.SortTypes, {
  asIdNameObject: function(obj) {
    console.log(obj);
    if (Ext.type(obj) === 'string') {
      console.log('string');
      return obj;
    } else if (Ext.type(obj) === 'object') {
      if (obj.name) {
        return obj.name;
      } else {
        return null;
      }
    } else if (Ext.type(obj) === 'array') {
      console.log('array');
      if (obj[0]) {
        console.log(obj[0].name);
        return obj[0].name;
      } else {
        return '';
      }
    }
    return '';
  }
});

Ext.define('Lizard.store.EditGridStore', {
  extend: 'Ext.data.Store',
  alias: 'store.leditstore',
  config: {
    something: false,
    pageSize: 25,
    remoteSort: true
  },
  setTempWriteParams: function(params) {
    this.notTmpParams = Ext.merge({}, this.proxy.extraParams);
    return this.proxy.extraParams = Ext.merge(this.proxy.extraParams, params);
  },
  applyParams: function(params) {
    if (!this.notTmpParams) {
      this.notTmpParams = Ext.merge({}, this.proxy.extraParams, params);
    } else {
      this.notTmpParams = Ext.merge(this.notTmpParams, params);
    }
    this.proxy.extraParams = Ext.merge(this.proxy.extraParams, params);
    return this.load();
  },
  rejectChanges: function() {
    Ext.each(this.removed, function(rec) {
      rec.join(this);
      this.data.add(rec);
      if (Ext.isDefined(this.snapshot)) return this.snapshot.add(rec);
    }, this);
    this.removed = [];
    this.getUpdatedRecords().forEach(function(rec) {
      if (rec.dirty === true) rec.reject();
      if (rec.phantom === true) {
        rec.unjoin(this);
        this.data.remove(rec);
        if (Ext.isDefined(this.snapshot)) return this.snapshot.remove(rec);
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
    Ext.apply(this, {
      idProperty: 'id'
    });
    this.callParent(arguments);
    return this;
  },
  listeners: {
    write: function(store, action, operation) {
      console.log('write:');
      console.log(arguments);
      store.proxy.extraParam = Ext.merge({}, store.notTmpParams);
      return Ext.MessageBox.alert('Opslaan gelukt');
    },
    beforeload: function(store, action, operation) {
      if (store.getNewRecords().length > 0 || store.getUpdatedRecords().length > 0 || store.getRemovedRecords().length > 0) {
        Ext.Msg.alert("Let op", 'Sla eerst de bewerking(en) in het grid op, voordat nieuwe data wordt geladen');
        return false;
      }
    }
  }
});
