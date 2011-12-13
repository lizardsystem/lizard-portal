Ext.define 'Lizard.window.HeaderTab'
    alias: 'widget.headertab'
    config:
        title: ''
        name: ''
        navigation_portal_template: null
        navigation:
            id: 'emptyNavigation'

        default_portal_template: ''
        active_portal_template: null
        object_types:[]


    constructor: (config) ->
        @initConfig(config)
        @callParent(arguments)

    initComponent: () ->
        me = @
        @callParent(arguments)