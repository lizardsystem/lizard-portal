
Ext.define 'Lizard.store.GraphStore',
    extend:'Ext.data.Store'
    alias: 'store.leditstore'
    config:
        reloadConfigOnNewObject: false
        dt_start
        dt_end


    bind: () ->
    
        me.on({
          "load" : me.onLoad,
          "clear" : me.onClear,
          "add" : me.onAdd,
          "remove" : me.onRemove,
          "update" : me.onUpdate,
          scope : me
        });

        
        me.data.on({
          "replace" : me.onReplace,
          scope : me
        });

    unbind: () ->
        me = @
        if me.map

            me.un("load", me.onLoad, me);
            me.un("clear", me.onClear, me);
            me.un("add", me.onAdd, me);
            me.un("remove", me.onRemove, me);
            me.un("update", me.onUpdate, me)
            me.data.un("replace", me.onReplace, me);



    onLoad: (store, records, options) ->


    onClear: () ->
        #todo

    onAdd: () ->
        #todo

    onRemove: () ->
        #todo

    onUpdate: () ->
        #todo


    onReplace: () ->
        #todo

    applyParams: (params) ->
        if reloadConfigOnNewObject:

            if not @notTmpParams
                @notTmpParams = Ext.merge({}, @proxy.extraParams, params)
            else
                @notTmpParams = Ext.merge(@notTmpParams, params)

            @proxy.extraParams = Ext.merge(@proxy.extraParams, params)

            @load()

        #todo loop through to update settings


    constructor: () ->
        @initConfig(arguments)
        @callParent(arguments)
    initComponent: () ->
        me = @

        @callParent(arguments)
        return @



