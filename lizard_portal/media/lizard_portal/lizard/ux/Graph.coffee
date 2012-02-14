
Ext.define 'Lizard.ux.Graph',
    extend:'Ext.data.Store'
    alias: 'store.leditstore'
    config:
        reloadConfigOnNewObject: false
        dt_start
        dt_end


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



