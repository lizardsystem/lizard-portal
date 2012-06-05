# Under construction. Need to be tested.
Ext.define('Lizard.model.CollageModel', {
    extend: 'Ext.data.Model',
    proxy:
        type: 'ajax'
        url: '/workspace/api/collage_view/',
        api:
            create: "/workspace/api/collage_view/?_accept=application/json&flat=false&action=create&" # Called when saving new records
            read: "/workspace/api/collage_view/?_accept=application/json&" # Called when reading existing records
            update: "/workspace/api/collage_view/?_accept=application/json&flat=false&action=update&" # Called when updating existing records
            destroy: "/workspace/api/collage_view/?_accept=application/json&flat=false&action=delete&" # Called when deleting existing records
        extraParams: {
            _accept: 'application/json'
        }

        params: {}

        writer:
            type: 'json',
            writeAllFields: true,
            root: 'data',
            successProperty: 'success',
            encode:true
        reader: {
            type: 'json'
            root: 'data'
            totalProperty: 'count'
        }
        afterRequest: (request, success) ->
            # debugger
            if request.method == 'POST'
                if success
                    Ext.MessageBox.alert('Opslaan gelukt')
                else
                    Ext.MessageBox.alert('Opslaan mislukt')
    fields: [{name: 'id', mapping: 'id', type: 'number'},
            {name: 'name', type: 'string'},
            {name: 'personal_category', type: 'string'},
            {name: 'category', type: 'auto'},
            {name: 'read_only', type: 'boolean'},
            {name: 'layers', type: 'auto'}]
});
