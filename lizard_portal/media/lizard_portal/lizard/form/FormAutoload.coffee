Ext.define('Lizard.form.FormAutoload', {
    extend: 'Ext.form.Panel'
    alias: 'widget.formautoload'
    config:
        loadProxy: null

    
    constructor: () ->
        @initConfig(arguments)
        @callParent(arguments)

    initComponent: () ->
        me = @



        @callParent(arguments)

    afterRender: () ->
        @callParent(arguments)
        if @getLoadProxy()
            @load(@getLoadProxy())
})