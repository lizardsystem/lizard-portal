Ext.define 'Lizard.window.HeaderTab'
    alias: 'widget.headertab'
    config:
        title: ''
        name: ''
        popup_navigation: false,
        popup_navigation_portal: false
        navigation: null #id of used navigation
        default_portal_template: ''
        active_portal_template: null
        object_types:[]


    constructor: (config) ->
        @initConfig(config)
        @callParent(arguments)

    initComponent: () ->
        me = @
        @callParent(arguments)



