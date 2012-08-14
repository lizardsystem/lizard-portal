# Provide store (Lizard.portlet.AvailableLayersPortlet)
# Provide layerFolderId: store will be fetched.
# Provide workspaceStore
Ext.define('Lizard.portlet.AvailableLayersPortlet', {
    extend: 'Ext.tree.Panel'
    # mixins: [
    #     'Lizard.portlet.Portlet'
    # ]
    alias: 'widget.availablelayersportlet'

    minHeight: 200,
    #items: [{}]
    title: 'Beschikbare kaarten'

    # The workspace stores which layers are checked.
    #store: Ext.data.StoreManager.lookup('Workspace'),



    root_map_slug: null
    title: 'Layers'
    rootVisible: false
    autoLoad:false

    onLayerClick: (record, checked, event, eOpts) ->
        # What is record kind of object or class?
        # Looks like a treenode thing, the raw property has the actual
        # workspace item data.
        if record.dirty == true
            if checked
                rec = record.raw
                rec.title = rec.text
                @workspaceItemStore.createWorkspaceItem(record.raw)
            else
                @workspaceItemStore.deleteWorkspaceItem(record.raw)
            @workspaceItemStore.sync()
            record.commit()


    initComponent: () ->
        me = @
        Ext.apply(@,
            listeners:
                checkchange: @onLayerClick
        )

        @callParent(arguments)
        @workspaceItemStore = @workspaceStore.workspaceItemStore

    afterRender: () ->
        # debugger
        @callParent(arguments)
        @store.load({
            params:
                object_id: @layerFolderId
        })
        if @workspaceItemStore
            @store.bind(@workspaceItemStore)


  })
