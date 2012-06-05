
Ext.apply(Ext.data.SortTypes, {
    asIdNameObject: (obj) ->
        console.log(obj)

        if Ext.type(obj) == 'string'
            console.log('string')
            return obj
        else if Ext.type(obj) == 'object'
            if obj.name
                return obj.name
            else
                return null
        else if Ext.type(obj) == 'array'
            console.log('array')
            if obj[0]
                console.log(obj[0].name)
                return obj[0].name
            else
                return ''

        return ''
})


Ext.define 'Lizard.store.EditGridStore',
    extend:'Ext.data.Store'
    alias: 'store.leditstore'
    config:
        something: false
        pageSize: 25
        remoteSort: true


    setTempWriteParams: (params) ->
        @notTmpParams = Ext.merge({}, @proxy.extraParams)
        @proxy.extraParams = Ext.merge(@proxy.extraParams, params)

    applyParams: (params) ->
        if not @notTmpParams
            @notTmpParams = Ext.merge({}, @proxy.extraParams, params)
        else
            @notTmpParams = Ext.merge(@notTmpParams, params)

        @proxy.extraParams = Ext.merge(@proxy.extraParams, params)

        @load()

    rejectChanges: () ->

        Ext.each(@removed, (rec) ->
            rec.join(@);
            @data.add(rec);
            if Ext.isDefined(@snapshot)
                @snapshot.add(rec)

        , @)
        @removed = [];

        Ext.each(@getUpdatedRecords(), (rec) ->
            if rec.dirty == true
                rec.reject()

            if rec.phantom == true
                rec.unjoin(@)
                @data.remove(rec)
                if Ext.isDefined(@snapshot)
                    @snapshot.remove(rec)
        , @)

        Ext.each(@getNewRecords(), (rec) ->
            @data.remove(rec)
        , @)
        
        this.fireEvent('datachanged', this);


    constructor: () ->
        @initConfig(arguments)
        @callParent(arguments)
    initComponent: () ->
        me = @

        Ext.apply(@, {
            idProperty: 'id'
        })

        @callParent(arguments)
        return @

    listeners:
        write: (store, action, operation) ->
            console.log('write:')
            console.log(arguments)
            #action.records.forEach((rec) ->
            #    if rec.dirty == true
            #        rec.commit()
            #)

            store.proxy.extraParam = Ext.merge({}, store.notTmpParams)

            Ext.MessageBox.alert('Opslaan gelukt');

        beforeload: (store, action, operation) ->
            if (store.getNewRecords().length >0 or store.getUpdatedRecords().length >0 or store.getRemovedRecords().length >0)
                Ext.Msg.alert("Let op", 'Sla eerst de bewerking(en) in het grid op, voordat nieuwe data wordt geladen')
                return false

