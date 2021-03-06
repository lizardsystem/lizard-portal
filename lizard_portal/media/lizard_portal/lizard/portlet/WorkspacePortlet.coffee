# Workspace portlet.
# Load workspace: choose from a list of workspaces.
# Save workspace: provide info, then save.

Ext.define('Lizard.portlet.WorkspacePortlet', {
    extend: 'Ext.grid.Panel'
    mixins: [
        'Lizard.portlet.Portlet'
    ]
    alias: 'widget.workspaceportlet'
    title: 'Workspace'
    #minHeight: 100, #todo: does not work
    #maxHeight: 200, #todo: does not work
    multiSelect: true,
    read_only: false,
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
            dragGroup: 'workspaceitem',
            dropGroup: 'workspaceitem'

    columns:[{
        text: 'aan',
        width: 35,
        dataIndex: 'visibility',
        xtype: 'checkcolumn',
        sortable: false
    },{
        text: 'selecteerbaar',
        width: 35,
        dataIndex: 'clickable',
        xtype: 'checkcolumn',
        onCheckChange: (column, record, recordIndex, value) ->
            if value == true
                record.store.setSelectableLayer(record);
            else
                record.store.setSelectableLayer();

        sortable: false,
    },{
        text: 'naam',
        flex: 1,
        sortable: false,
        dataIndex: 'title'
    },{
        text: 'laad',
        width: 35,
        sortable: false,
        xtype: 'loadingcolumn',
        dataIndex: 'loading'
    }],

    clear: () ->
        index = @workspaceStore.workspaceItemStore.find('is_base_layer', true)
        old_background = @workspaceStore.workspaceItemStore.getAt(index)
        @workspaceStore.workspaceItemStore.removeAll()
        @workspaceStore.removeAll()
        background_pref = Lizard.CM.getContext().background_layer
        if background_pref
            @workspaceStore.workspaceItemStore.insert(0, background_pref)
        else
            @workspaceStore.workspaceItemStore.insert(0, old_background)

    loadWorkspace: (config) ->
        me = @
        config = config
        params = config.params || {}

        @workspaceStore.load({
            params:
                object_id: params
            callback: (records, operation, success) ->

                if config.callback
                    config.callback(records, operation, success)
        })
    tools:true

    onClick: (view, record, item, index, event, eOpts) ->
        arguments
        debugger

    create_workspace_window: (portlet) ->
        portlet = portlet
        config = {
            extend: 'Ext.grid.Panel'
            #alias: 'widget.manageworkspacesportlet'
            title: 'Beheer workspaces',
            width: 1000,
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
            proxyUrl: '/workspace/api/workspace_view/'
            proxyParams: {}
            enterEditSummary: false
            addEditIcon: false
            addDeleteIcon: true
            usePagination: false
            useAddDeleteButtons: false
            read_only_field: 'read_only',

            addExtraActionIcon: true
            extraActionIconUrl: '/static_media/lizard_portal/images/hand.png'
            extraActionIconTooltip: 'openen'
            actionExtraActionIcon: (record) ->
                portlet.loadWorkspace({
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
               type: 'save',  # Save
               tooltip: 'Workspace opslaan'
               handler: (e, target, panelHeader, tool) ->
                   portlet = panelHeader.ownerCt;

                   Ext.create('Ext.window.Window', {
                   title: 'Bewaar workspace',
                   modal: true,
                   xtype: 'leditgrid'
                   editpopup: true,
                   constrainHeader: true,
                   items: [{
                   xtype: 'workspacesaveform',
                   workspaceStore: portlet.workspaceStore
                   layerStore: portlet.workspaceStore.workspaceItemStore
                   save_callback: (record) ->
                       #pass
                   }]
                   }).show();
               }
               {
               type: 'gear',  # Manage
               tooltip: 'Workspace beheer'
               handler: (e, target, panelHeader, tool) ->
                   portlet = panelHeader.ownerCt;
                   a = portlet.html;

                   portlet.create_workspace_window(portlet)

               },

               {
               type: 'delete-single'
               tooltip: 'Workspace item verwijderen (na selectie)'
               handler: (e, target, panelHeader, tool) ->
                   portlet = panelHeader.ownerCt;
                   records = portlet.getSelectionModel().selected.items
                   portlet.store.remove(records)
               }
               {
               type: 'delete',
               tooltip: 'Workspace legen'
               handler: (e, target, panelHeader, tool) ->
                   portlet = panelHeader.ownerCt;
                   portlet.clear()

               }]
    initComponent: () ->
        me = @

        @store = @workspaceStore.workspaceItemStore

        if me.read_only
            me.tools[0].disabled = true


            #delete me.tools[1] #save

        #if not @workspaceStore
        #if not @workspaceStore
            #@workspaceStore = Ext.create(Lizard.store.WorkspaceStore, {layerStore: @store})
        #@addListener('checkchange', onClick)
        Ext.apply(@,
            listeners:
                itemclick: @onClick
        )

        @callParent(arguments)
})

