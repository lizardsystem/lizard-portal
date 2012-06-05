# see AvailableLayersPortlet
Ext.define('Lizard.store.AvailableLayersStore', {
    extend: 'Ext.data.TreeStore'
    # extend: 'GeoExt.data.LayerStore'
    alias: 'store.availablelayersstore'
    #model: 'Lizard.model.AvailableLayersModel'
    rootVisible: false,
    #storeId: 'WorkspaceStore'
    #indexOf: Ext.emptyFn,

    # autoLoad: true
    # data: {
    #     root: {
    #         expanded: true,
    #         children: [
    #             { text: "detention", leaf: true, checked: false },
    #             { text: "homework", expanded: true, children: [
    #                 { text: "book report", leaf: true, checked: false },
    #                 { text: "alegrbra", leaf: true, checked: false }
    #             ] },
    #             { text: "buy lottery tickets", leaf: true, checked: false }
    #         ]
    #     }
    # }


    # Quick fix (kan netter en efficienter)
    #
    setChecks: (store, etc) ->
        me = @

        ids = []
        @workspaceStore.each((record) ->
          ids.push(record.get('id'))
          return
        )


        Ext.Object.each(me.tree.nodeHash, (key, record) ->
            if record.raw and record.get('leaf') == true
                if record.raw.plid in ids
                  record.set('checked', true)
                else
                  record.set('checked', false)
                if record.dirty
                  record.commit()

                return
        )

    bind: (workspaceStore) ->
        me = @
        @workspaceStore = workspaceStore
        @workspaceStore.on({
            "load" : me.setChecks,
            "clear" : me.setChecks,
            "add" : me.setChecks,
            "remove" : me.setChecks,
            #"update" : me.setChecks,
            "datachanged" : me.setChecks,
            scope : me
        })
        @workspaceStore.data.on({
            "replace" : me.setChecks,
            scope : me
        })

        @on({
          'load': me.setChecks
        })

        @setChecks(workspaceStore)


    unbind: () ->
        me = @
        @workspaceStore.un("load", me.setChecks, me);
        @workspaceStore.un("clear", me.setChecks, me);
        @workspaceStore.un("add", me.setChecks, me);
        @workspaceStore.un("remove", me.setChecks, me);
        #@workspaceStore.un("update", me.setChecks, me);
        @workspaceStore.un("datachanged", me.setChecks, me);
        @workspaceStore.data.un("replace", me.setChecks, me);
        @workspaceStore = null

        @un({
          'load': me.setChecks
        })


    autoLoad: false
    proxy: {
        type: 'ajax'
        url: '/workspace/api/app_layer_tree/'
        extraParams: {
            _accept: 'application/json'
        }
        reader: {
            type: 'json'
            #root: 'data'
        }
    }
    initComponent: () ->



      @callParent(arguments)

      if @workspaceStore
          @bind(@workspaceStore)

    onDestroy: () ->
      @unbind()


})
