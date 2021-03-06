(function() {
  var __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Ext.define('Lizard.store.AvailableLayersStore', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.availablelayersstore',
    rootVisible: false,
    setChecks: function(store, etc) {
      var ids, me;
      me = this;
      ids = [];
      this.workspaceStore.each(function(record) {
        ids.push(record.get('id'));
      });
      return Ext.Object.each(me.tree.nodeHash, function(key, record) {
        var _ref;
        if (record.raw && record.get('leaf') === true) {
          if (_ref = record.raw.plid, __indexOf.call(ids, _ref) >= 0) {
            record.set('checked', true);
          } else {
            record.set('checked', false);
          }
          if (record.dirty) record.commit();
        }
      });
    },
    bind: function(workspaceStore) {
      var me;
      me = this;
      this.workspaceStore = workspaceStore;
      this.workspaceStore.on({
        "load": me.setChecks,
        "clear": me.setChecks,
        "add": me.setChecks,
        "remove": me.setChecks,
        "datachanged": me.setChecks,
        scope: me
      });
      this.workspaceStore.data.on({
        "replace": me.setChecks,
        scope: me
      });
      this.on({
        'load': me.setChecks
      });
      return this.setChecks(workspaceStore);
    },
    unbind: function() {
      var me;
      me = this;
      this.workspaceStore.un("load", me.setChecks, me);
      this.workspaceStore.un("clear", me.setChecks, me);
      this.workspaceStore.un("add", me.setChecks, me);
      this.workspaceStore.un("remove", me.setChecks, me);
      this.workspaceStore.un("datachanged", me.setChecks, me);
      this.workspaceStore.data.un("replace", me.setChecks, me);
      this.workspaceStore = null;
      return this.un({
        'load': me.setChecks
      });
    },
    autoLoad: false,
    proxy: {
      type: 'ajax',
      url: '/workspace/api/app_layer_tree/',
      extraParams: {
        _accept: 'application/json'
      },
      reader: {
        type: 'json'
      }
    },
    initComponent: function() {
      this.callParent(arguments);
      if (this.workspaceStore) return this.bind(this.workspaceStore);
    },
    onDestroy: function() {
      return this.unbind();
    }
  });

}).call(this);
