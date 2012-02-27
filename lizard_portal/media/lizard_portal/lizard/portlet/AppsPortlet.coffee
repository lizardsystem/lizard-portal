# Portlet that contains all available apps. Interaction is a little
# bit different than AppScreen.
#
Ext.define('Lizard.portlet.AppsPortlet', {
    extend: 'Lizard.portlet.Portlet'
    alias: 'widget.appsportlet'

    initComponent: () ->
        me = @
        Ext.apply(@, {
            layout:
                type: 'vboxscroll'
                align: 'stretch'

            defaults:
                flex: 1,
                height: 250

            autoScroll:true
            items: {
                xtype: 'dataview',
                store: @store,
                tpl: new Ext.XTemplate(
                    '<tpl for=".">',
                        '<div class="app_icon draggable"><a href="{url}" title="{description}">',
                                '<img src="/static_media/lizard_portal/app_icons/metingen.png" ',
                                'id="app-{slug}" />',
                                '<div>{name} ({type})</div>',
                        '</a></div>',
                    '</tpl>'
                ),
            }
        })

        @callParent(arguments)
})

