Ext.define('Lizard.portlet.AvailableLayersPortlet', {
    extend: 'Lizard.portlet.Portlet'
    # mixins: [
    #     'Lizard.portlet.Portlet'
    # ]
    alias: 'widget.availablelayersportlet'
    autoHeight: true,
    minHeight: 200,
    #items: [{}]
    title: 'Beschikbare kaarten'

    # The workspace stores which layers are checked.
    store: Ext.data.StoreManager.lookup('Workspace'),

    items: [
        {
            xtype: 'tabpanel'
            tabPosition: 'bottom'
            items: [
                {
                    title: 'Browse'
                    xtype: 'dataview',
                    store: @store,
                    # store: Ext.create('Ext.data.Store', {
                    #     model: Ext.create('Ext.data.Model', {
                    #         fields: ['id', 'text']
                    #         idProperty: 'id'
                    #     })
                    #     proxy: {
                    #         type: 'ajax',
                    #         url : '/workspace/api/layer_view/',
                    #         reader: {
                    #             type: 'json',
                    #             root: 'data'
                    #         }
                    #     }
                    #     autoLoad: true
                    # })
                    id: 'browser'
                    tpl: new Ext.XTemplate(
                        '<tpl for=".">',
                            '<div class="app_icon draggable"><a href="{url}" title="{description}">',
                                    '<img src="/static_media/lizard_portal/app_icons/metingen.png" ',
                                    'id="app-{slug}" />',
                                    '<div>{name} ({type})</div>',
                            '</a></div>',
                        '</tpl>'
                    ),
                    itemSelector: 'div.apps-source',
                    renderTo: Ext.getBody()
                }
                {
                    title: 'Layers'
                    xtype: 'treepanel'
                    id: 'layersTree'
                    # Why doesn't this work?
                    # store: Ext.data.StoreManager.lookup('AvailableLayers')
                    # onRender: () ->

                    #     @callParent(arguments)
                    #     @store.load()

                    store: Ext.create('Ext.data.TreeStore', {
                        root: {
                            text: 'Title'
                            expanded: true,
                            id: 'root-id'
                        }
                        autoLoad: true
                        proxy: {
                            type: 'ajax'
                            url: '/workspace/api/layer_view/'
                            reader: {
                                type: 'json'
                                root: 'data'
                            }
                        }
                    })
                    # initComponent: () ->
                    #     check_store = Ext.data.StoreManager.lookup('AvailableLayers')
                    #     if check_store == undefined
                    #         Ext.create(Lizard.store.LayerStore, {storeId: 'AvailableLayers'} )

                    #     @callParent(arguments)
                }
            ]
        }]

    initComponent: () ->
        me = @

        @callParent(arguments)
  })
