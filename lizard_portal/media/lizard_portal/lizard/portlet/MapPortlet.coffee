# Workspace portlet.
# Load workspace: choose from a list of workspaces.
# Save workspace: provide info, then save.

Ext.define('Lizard.portlet.MapPortlet', {
    extend: 'GeoExt.panel.Map'
#    mixins: [
#        'Lizard.portlet.Portlet'
#    ]
    alias: 'widget.mapportlet'
    title: 'Map'
    #store = LayerStore
    #workspace store?

    tbar: [{
        xtype: 'button',
        text: 'test'
    }
    '->'
    {
        fieldLabel: 'Achtergrondkaart',
        name: 'base_layer',
        displayField: 'name',
        valueField: 'id',
        xtype: 'combo',
        queryMode: 'remote',
        typeAhead: false,
        minChars:0,
        forceSelection: true,
        width: 200,
        store: {
            fields: ['id', 'name'],
            proxy: {
                type: 'ajax',
                url: '/measure/api/organization/?_accept=application%2Fjson&size=id_name',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            }
        }
    }]

    initComponent: () ->
        me = @

#        if not @workspaceStore
#            @workspaceStore = Ext.create(Lizard.store.WorkspaceStore, {layerStore: @store})

        @callParent(arguments)
})

