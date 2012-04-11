Ext.define('Lizard.portlet.MultiLegendPortlet', {
    extend: 'Lizard.portlet.MultiImagePortlet'
    alias: 'widget.multilegendportlet'

    getGraphButtonConfig: () ->
        return []

    calcHeights: (new_width=null, new_height=null, new_fit=null) ->
        width = new_width || 238
        height = new_width || @body.getSize().height - 20

        for display_item in @store.data.items
            display_item.beginEdit()
            display_item.set('height', height)
            display_item.set('width', width)
            display_item.endEdit()

    # initComponent: () ->
    #     me = @
    #     @callParent(arguments)


})
