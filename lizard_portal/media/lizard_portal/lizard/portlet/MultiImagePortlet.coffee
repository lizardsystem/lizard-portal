# When creating a MultiImagePortlet, provide a store with parameters name, base_url
Ext.define('Lizard.portlet.MultiImagePortlet', {
    # extend: 'Lizard.portlet.MultiGraphStore'
    extend: 'Lizard.portlet.Portlet'

    alias: 'widget.multiimageportlet'
    layout:
        type: 'vboxscroll'
        align: 'stretch'
    autoScroll:true

    initComponent: () ->
        me = @

        Ext.apply(@, {
            items: {
                xtype: 'dataview'
                store: @store
                tpl: new Ext.XTemplate(
                    '<tpl for=".">',
                        '<div class="thumb-wrap">',
                          '<span>{name}</span><br />'
                          '<img src="{base_url}" />',
                        '</div>',
                    '</tpl>'
                )
                # itemSelector is necessary, else your portlet will crash
                itemSelector: 'div.thumb-wrap'
            }
        })

        @callParent(arguments)
})
