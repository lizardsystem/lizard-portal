#
#
#
Ext.define('Lizard.portlet.WorkspacePortlet', {
    extend: 'Ext.grid.Panel'
    mixins: [
        'Lizard.portlet.Portlet'
    ]
    alias: 'widget.workspaceportlet'
    title: 'Workspace'
    autoHeight: true,
    minHeight: 200,

    store: Ext.data.StoreManager.lookup('Workspace'),

    #config:
    #    params

    #applyParams: (new_value) ->
    #    @store.load(new_value)

    columns:[{
        text: 'aan',
        width:35,
        dataIndex: 'visibility',
        xtype: 'checkcolumn',
        sortable: true
    },{
        text: 'Naam',
        flex: 1,
        sortable: true,
        dataIndex: 'title'
    }],
    tools: [{
        type: 'save',
        handler: (e, target, panelHeader, tool) ->
            portlet = panelHeader.ownerCt;
            a = portlet.html;

            form_window = Ext.create('Ext.window.Window', {
                title: 'Save workspace',
                width: 400,
                height: 300
            }).show()
    }
    {
        type: 'gear',
        handler: (e, target, panelHeader, tool) ->
            portlet = panelHeader.ownerCt;
            a = portlet.html;

            form_window = Ext.create('Ext.window.Window', {
                title: 'Save workspace',
                width: 400,
                height: 300
            }).show()

    }]







    initComponent: () ->


        @callParent(arguments)
})

