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
    





    initComponent: () ->
        me = @

        @callParent(arguments)

    afterRender: () ->
        debugger
        @callParent(arguments)
        @store.load({
            params:
                object_id: @root_map_slug
        })


  })
