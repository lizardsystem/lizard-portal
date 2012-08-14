# Collage portlet. Experimental. Copied from WorkspacePortlet
# Load collage: choose from a list of collages.
# Save collage: provide info, then save.

Ext.define('Lizard.portlet.CollagePortlet', {
    extend: 'Ext.grid.Panel'
    # extend: 'Lizard.portlet.WorkspacePortlet'
    alias: 'widget.collageportlet'
    title: 'Collage'
    read_only: false,
    # store: Ext.data.StoreManager.lookup('Workspace'),
    viewConfig:
        #Return CSS class to apply to rows depending upon data values

        plugins:
            ptype: 'gridviewdragdrop',
            dragGroup: 'collageitem',
            dropGroup: 'collageitem'


    columns:[{
        text: 'aan',
        width:35,
        dataIndex: 'visibility',
        xtype: 'checkcolumn',
        sortable: true
    },{
        text: 'sel',
        width:35,
        dataIndex: 'clickable',
        xtype: 'checkcolumn',
        sortable: true
    },{
        text: 'Naam',
        flex: 1,
        sortable: true,
        dataIndex: 'title'
    }],

    clear: () ->
        @collageStore.collageItemStore.removeAll()
        @collageStore.removeAll()

    loadCollage: (config) ->
        me = @
        config = config
        params = config.params || {}

        @collageStore.load({
            params:
                object_id: params
            callback: (records, operation, success) ->

                if config.callback
                    config.callback(records, operation, success)
        })
    create_collage_window: (portlet) ->
        portlet = portlet


        config = {

             extend: 'Ext.grid.Panel'
             #alias: 'widget.manageworkspacesportlet'
             title: 'Beheer collages',
             width: 1000
             height: 600,
             modal: true,
             constrainHeader: true,
             layout:
                 type: 'vbox'
                 align: 'stretch'

             items: [{
             xtype: 'leditgrid'
             flex:1,
             autoScroll: true
             proxyUrl: '/workspace/api/collage_view/'
             proxyParams: {}
             enterEditSummary: false
             addEditIcon: false
             addDeleteIcon: true
             usePagination: false
             read_only_field: 'read_only',
             useAddDeleteButtons: false
             addExtraActionIcon: true
             extraActionIconUrl: '/static_media/lizard_portal/images/hand.png'
             extraActionIconTooltip: 'openen'
             actionExtraActionIcon: (record) ->
                 portlet.loadCollage({
                     params:
                         object_id:record.get('id')
                     callback: (records, operation, success) ->
                         if success

                             form_window.close()
                         else
                             alert('laden mislukt')
                     })

             dataConfig: [
                 {name: 'id', title: 'id', editable: false, visible: false, width: 50, type: 'number'}
                 {name: 'name', title: 'Naam', editable: true, visible: true, width: 250, type: 'text'}
                 {name: 'personal_category', title: 'persoonlijke tag', editable: true, visible: true, width: 200, type: 'text'}
                 #{name: 'category', title: 'Categorie', editable: true, visible: true, width: 150, type: 'gridcombobox', choices:[{id:1, name:'test'},{id:2, name:'testtest'}]}
                 {name: 'owner_type', title: 'Type', editable: true, visible: true, width: 80, type: 'gridcombobox', choices:[{id:0, name:'User'},{id:2, name:'Public'},{id:3, name:'Organisatie'}]}
                 {name: 'data_set', title: 'Dataset', editable: false, visible: false, width: 150, type: 'gridcombobox'}
                 {name: 'owner', title: 'Eigenaar', editable: false, visible: true, width: 100, type: 'gridcombobox'}
                 {name: 'read_only', title: 'alleen_lezen', editable: false, visible: false, width: 50, type: 'boolean'}
                 {name: 'datetime_created', title: 'aangemaakt', editable: false, visible: true, width: 150, type: 'text'}
                 {name: 'datetime_modified', title: 'gewijzigd', editable: false, visible: true, width: 150, type: 'text'}
             ]
             storeAutoLoad: true
             # How to reload store after a new item has been added?
             }]
        }
        if @read_only
            config.items[0].editable = false
            config.items[0].addDeleteIcon = false


        form_window = Ext.create('Ext.window.Window', config).show()


    tools: [
        {
            type: 'collapse',  # Popup
            tooltip: 'Collage scherm'
            handler: (e, target, panelHeader, tool) ->
                # Create new temp collage, then open a new window with that collage
                portlet = panelHeader.ownerCt;

                # From: CollageSaveForm
                collage = Ext.create('Lizard.model.CollageModel', {})
                collage.set('name', 'huidige collage')
                collage.set('personal_category', '')
                layers = portlet.collageStore.collageItemStore
                collage_layers = []
                order_nr = 0

                layers.each( (record) ->

                    record.order = order_nr
                    order_nr += 1
                    record.commit()

                    collage_layers.push(record.store.proxy.writer.getRecordData(record))
                    return
                )
                collage.set('layers', collage_layers)
                collage.set('is_temp', true)
                # This "pre-opens" a window in a tab.
                window.open('/workspace/collage_placeholder/', 'collage-popup')
                collage.save({
                    callback: (record, operation) ->
                        if operation.wasSuccessful()
                            context = Ext.getCmp('portalWindow').context_manager.getContext()
                            dt = '?dt_start=' + Ext.Date.format(context.period.start, 'Y-m-d H:i:s') + '&dt_end=' + Ext.Date.format(context.period.end, 'Y-m-d H:i:s')
                            url = '/workspace/collage/' + record.data.secret_slug + '/' + dt
                            # Argh callbacks open in a new window which get blocked in the browser by default
                            # So we pre-opened a page, the window.open is not blocked.
                            window.open(url, 'collage-popup')
                })

        },
        {
            type: 'save',  # Save
            tooltip: 'Collage opslaan',
            handler: (e, target, panelHeader, tool) ->
                portlet = panelHeader.ownerCt;

                Ext.create('Ext.window.Window', {
                    title: 'Bewaar collage',
                    modal: true,
                    xtype: 'leditgrid'
                    editpopup: true,
                    constrainHeader: true,
                    items: [{
                        xtype: 'collagesaveform',
                        collageStore: portlet.collageStore
                        layerStore: portlet.collageStore.collageItemStore
                        save_callback: (record) ->
                            #pass
                    }]
                }).show();
        }
        {
            type: 'gear',  # Manage
            tooltip: 'Collages beheren'
            handler: (e, target, panelHeader, tool) ->
                portlet = panelHeader.ownerCt;
                a = portlet.html;

                portlet.create_collage_window(portlet)
        },
        {
        type: 'delete',
        tooltip: 'Collage legen',
        handler: (e, target, panelHeader, tool) ->
            portlet = panelHeader.ownerCt;
            portlet.clear()

        }
          {
            type: 'delete-single'
            tooltip: 'Collage item verwijderen (na selectie)'
            handler: (e, target, panelHeader, tool) ->
              portlet = panelHeader.ownerCt;
              records = portlet.getSelectionModel().selected.items
              portlet.store.remove(records)

          }]

    onCollageItemClick: (view, record, item, index, event, e0pts) ->
        # Put all records from the store that have the same
        # popup_class_name as the selected record in the popup.
        records = []
        js_popup_class = record.get('js_popup_class')
        grouping_hint = record.get('grouping_hint')

        for collage_item in @store.data.items
            if collage_item.get('grouping_hint') == grouping_hint
                collage_item_identifier = Ext.JSON.decode(collage_item.get('identifier'))
                # Specific for time series
                collage_item.set('geo_ident', collage_item_identifier['geo_ident'])
                collage_item.set('par_ident', collage_item_identifier['par_ident'])
                collage_item.set('stp_ident', collage_item_identifier['stp_ident'])
                collage_item.set('mod_ident', collage_item_identifier['mod_ident'])
                collage_item.set('qua_ident', collage_item_identifier['qua_ident'])
                collage_item.set('fews_norm_source_slug', collage_item_identifier['fews_norm_source_slug'])
                collage_item.set('is_collage_item', true)  # For showing "Voeg toe aan collage" yes/no
                records.push(collage_item)

        popup_class_name = 'Lizard.popup.' + js_popup_class
        popup_class = Ext.ClassManager.get(popup_class_name)
        if not popup_class
            # Default fall-back
            popup_class = Ext.ClassManager.get('Lizard.popup.FeatureInfo')
            console.error("Cannot find popup class " + popup_class_name + ", fallback to default.")
        # Make fake workspace item
        workspaceitem = Ext.create('Lizard.model.WorkspaceItemModel', {})
        # workspaceitem.set('text', record.get('text'))
        workspaceitem.set('title', record.get('title'))
        # workspaceitem.set('plid', record.get('plid'))

        popup_class.show(records, workspaceitem)

    initComponent: () ->
        me = @

        if me.read_only
            me.tools[0].disabled = true

        @store = @collageStore.collageItemStore
        Ext.apply(@,
            listeners:
                itemclick: @onCollageItemClick
        )


        @callParent(arguments)
})
