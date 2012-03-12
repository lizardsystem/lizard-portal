# Collage portlet. Experimental. Copied from WorkspacePortlet
# Load collage: choose from a list of collages.
# Save collage: provide info, then save.

Ext.define('Lizard.portlet.CollagePortlet', {
    extend: 'Ext.grid.Panel'
    # extend: 'Lizard.portlet.WorkspacePortlet'
    alias: 'widget.collageportlet'
    title: 'Collage'

    # store: Ext.data.StoreManager.lookup('Workspace'),
    viewConfig:
        #Return CSS class to apply to rows depending upon data values
        getRowClass: (record, index)  ->
            c = record.get('is_base_layer');
            if c == true
                return 'l-grey'
            else
                return ''

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
        index = @collageStore.workspaceItemStore.find('is_base_layer', true)
        old_background = @collageStore.workspaceItemStore.getAt(index)
        @collageStore.workspaceItemStore.removeAll()
        @collageStore.removeAll()
        background_pref = Lizard.CM.getContext().background_layer
        if background_pref
            @collageStore.workspaceItemStore.insert(0, background_pref)
        else
            @collageStore.workspaceItemStore.insert(0, old_background)

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
    tools: [{
        type: 'unpin',  # Save
        handler: (e, target, panelHeader, tool) ->
            portlet = panelHeader.ownerCt;
            portlet.clear()

    }
    {
        type: 'save',  # Save
        handler: (e, target, panelHeader, tool) ->
            portlet = panelHeader.ownerCt;

            Ext.create('Ext.window.Window', {
                title: 'Bewaar collage',
                modal: true,
                xtype: 'leditgrid'
                editpopup: true,
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
        handler: (e, target, panelHeader, tool) ->
            portlet = panelHeader.ownerCt;
            a = portlet.html;

            form_window = Ext.create('Ext.window.Window',
            {

                extend: 'Ext.grid.Panel'
                #alias: 'widget.manageworkspacesportlet'
                title: 'Beheer collages',
                width: 600
                height: window.innerHeight - 200,
                modal: true,
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
                    addEditIcon: true
                    addDeleteIcon: true
                    usePagination: false
                    read_only_field: 'read_only',
                    actionEditIcon: (record) ->
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
                      {name: 'owner_type', title: 'Type', editable: false, visible: true, width: 60, type: 'gridcombobox'}
                      {name: 'data_set', title: 'Dataset', editable: false, visible: false, width: 150, type: 'gridcombobox'}
                      {name: 'owner', title: 'Eigenaar', editable: false, visible: false, width: 150, type: 'gridcombobox'}
                      {name: 'read_only', title: 'alleen_lezen', editable: false, visible: false, width: 50, type: 'boolean'}
                      ]
                    storeAutoLoad: true
                    # How to reload store after a new item has been added?
                }]
            }).show()

    },
      {
        type: 'pin'
        handler: (e, target, panelHeader, tool) ->
          portlet = panelHeader.ownerCt;
          records = portlet.getSelectionModel().selected.items
          portlet.store.remove(records)

      }]

    initComponent: () ->
        me = @

        @store = @collageStore.collageItemStore

        @callParent(arguments)
})
