Ext.define('Lizard.model.WorkspaceModel', {
    extend: 'Ext.data.Model',
    proxy:
        type: 'ajax'
        url: '/workspace/api/workspace_view/',
        api:
            create: "/workspace/api/workspace_view/?_accept=application/json&flat=false&action=create&" # Called when saving new records
            read: "/workspace/api/workspace_view/?_accept=application/json&" # Called when reading existing records
            update: "/workspace/api/workspace_view/?_accept=application/json&flat=false&action=update&" # Called when updating existing records
            destroy: "/workspace/api/workspace_view/?_accept=application/json&flat=false&action=delete&" # Called when deleting existing records
        extraParams: {}

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
            {name: 'layers', type: 'auto'}]
});
