# A screen with (user selected) apps.
Ext.define('Lizard.portlet.AppScreenPortlet', {
    # A specialized Ext.panel.Panel
    extend: 'Ext.view.View'
    alias: 'widget.appscreenportlet'

    #store meegeven bij aanmaken
    #start_appscreen_slug voor initiele laad van appscreen

    layout:
        type: 'vboxscroll'
        align: 'stretch'

    defaults:
        flex: 1,
        height: 250

    autoScroll:true

    tpl: new Ext.XTemplate(
        '<tpl for=".">',
            '<div class="app_icon" >',
                    '<img src="{icon}" ',
                    'id="app-{slug}" />',
                    '<div>{name}</div>',
            '</div>',
        '</tpl>'
    )
    itemSelector: 'div.app_icon',

    onAppClick: (view, record) ->
        tabpanel = @up('tabpanel')
        tab = tabpanel.child('#app' + record.get('slug'))
        if tab
            tabpanel.setActiveTab(tab)
        else
            action_type = record.get('action_type')
            if action_type == 10
                @store.load({
                    params:
                        object_id: record.get('target_app_slug')
                })
            else if action_type == 20
                # Open layer folders
                app = Ext.create('Lizard.portlet.AvailableLayersPortlet',{
                    store: Ext.create('Lizard.store.AvailableLayersStore', {id:'appst'+ record.get('slug')}),
                    root_map_slug: record.get('action_params').root_map,
                    title: record.get('name')
                    id: 'app' + record.get('slug')
                })

                tab = tabpanel.add(app)
                tabpanel.setActiveTab(tab)
            else
                alert('actiontype not yet supported: ' + action_type)



    initComponent: () ->
        me = @
        #console.log('Jack Init portlet')
        #
        # Apply the store to the items
        Ext.apply(@,

            listeners:
                itemclick: @onAppClick



        )

        @callParent(arguments)

    afterRender: () ->
        @callParent(arguments)
        @store.load({
            params:
                object_id: @start_appscreen_slug
        })

})

