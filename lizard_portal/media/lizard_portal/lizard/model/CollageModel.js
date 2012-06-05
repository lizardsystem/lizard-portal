(function() {

  Ext.define('Lizard.model.CollageModel', {
    extend: 'Ext.data.Model',
    proxy: {
      type: 'ajax',
      url: '/workspace/api/collage_view/',
      api: {
        create: "/workspace/api/collage_view/?_accept=application/json&flat=false&action=create&",
        read: "/workspace/api/collage_view/?_accept=application/json&",
        update: "/workspace/api/collage_view/?_accept=application/json&flat=false&action=update&",
        destroy: "/workspace/api/collage_view/?_accept=application/json&flat=false&action=delete&"
      },
      extraParams: {
        _accept: 'application/json'
      },
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
        if (request.method === 'POST') {
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
        name: 'read_only',
        type: 'boolean'
      }, {
        name: 'layers',
        type: 'auto'
      }
    ]
  });

}).call(this);
