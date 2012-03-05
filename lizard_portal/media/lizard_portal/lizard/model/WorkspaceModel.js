(function() {
  Ext.define('Lizard.model.WorkspaceModel', {
    extend: 'Ext.data.Model',
    proxy: {
      type: 'ajax',
      url: '/workspace/api/workspace_view/',
      api: {
        create: "/workspace/api/workspace_view/?_accept=application/json&flat=false&action=create&",
        read: "/workspace/api/workspace_view/?_accept=application/json&",
        update: "/workspace/api/workspace_view/?_accept=application/json&flat=false&action=update&",
        destroy: "/workspace/api/workspace_view/?_accept=application/json&flat=false&action=delete&"
      },
      extraParams: {},
      params: {},
      writer: {
        type: 'json',
        writeAllFields: true,
        root: 'data',
        successProperty: 'success',
        encode: true
      },
      reader: {
        type: 'json',
        root: 'data',
        totalProperty: 'count'
      },
      afterRequest: function(request, success) {
        debugger;        if (request.method === 'POST') {
          if (success) {
            return Ext.MessageBox.alert('Opslaan gelukt');
          } else {
            return Ext.MessageBox.alert('Opslaan mislukt');
          }
        }
      }
    },
    fields: [
      {
        name: 'id',
        mapping: 'id',
        type: 'number'
      }, {
        name: 'name',
        type: 'string'
      }, {
        name: 'personal_category',
        type: 'string'
      }, {
        name: 'category',
        type: 'auto'
      }, {
        name: 'layers',
        type: 'auto'
      }
    ]
  });
}).call(this);
