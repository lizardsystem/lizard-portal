Ext.define 'Lizard.window.Header',
    extend:'Ext.panel.Panel'
    alias: 'widget.pageheader'
    config:
        tabs: []
        user: 
            id: null
            name: ''
        activetab: 0




    setBreadCrumb:(bread_crumbs) ->
        me = @
        breadcrumb = Ext.getCmp('breadcrumb')
        bread_div = breadcrumb.el
        a = bread_div.down('div')
        while a
            a.remove()
            a = bread_div.down('div')

        a = bread_div.down('a')
        while a
            a.remove()
            a = bread_div.down('a')

        element = {
            tag: 'div',
            cls: 'link',
            html: 'aan-afvoergebied'
        }

        bread_div.createChild(element)
        el = bread_div.last()
        el.addListener('click',
                        () ->
                            me.showAreaSelection()
        )

        if bread_crumbs
            bread_div.createChild({
                tag: 'div',
                html: ' - '
            })
            for crumb in bread_crumbs
                if crumb.link
                    element = {
                        tag: 'div',
                        cls: 'link',
                        html: crumb.name
                    }

                    bread_div.createChild(element)
                    el = bread_div.last()
                    el.addListener('click'
                                   (evt, obj, crumb_l) ->
                                        me.linkTo({portalTemplate: crumb_l.link})
                                   @,
                                   crumb)
                    bread_div.createChild({
                        tag: 'div',
                        html: ' - '
                    })
                else
                    bread_div.createChild({
                        tag: 'div',
                        html: crumb.name
                    })

    constructor: (config) ->
        @initConfig(arguments)
        @callParent(arguments)
    initComponent: () ->
        me = @


        header_items = [
            { xtype: 'tbspacer', width: 200 },
            '->'
        ]

        for tab in @tabs
           header_items.push({
                text: tab.title
                xtype: 'button'
                cls: 'l-headertab'
                toggleGroup: 'headertab'
           })

        header_items.push('->')

        user = @getUser()

        if user.id == null
            header_items.push({
                text: 'login',
                xtype: 'button'
                handler: (button, event, eOpts) ->
                    Ext.MessageBox.alert('TO DO', 'TO DO')
                componentCls: 'l-headertabs'
            })
        else
            header_items.push({
                text: @getUser().name,
                xtype: 'button'
                componentCls: 'l-headertabs'
                menu: [{
                        text: 'Instellingen'
                        handler: (button, event, eOpts) ->
                            Ext.MessageBox.alert('release 2', 'release2')
                    }
                    '-'
                    {
                        text: 'log uit'
                        handler: (button, event, eOpts) ->
                            Ext.MessageBox.alert('TO DO', 'TO DO')
                    }]
                listeners:
                    mouseover: {
                        fn: (button, event, eOpts) ->
                            console.log('over user')
                    }
            }
            '-'
            {
                iconCls: 'settings'
                xtype: 'button'
                bodyCls: 'l-headertab'
            })

        Ext.apply @,
            #layout:
            #    type: 'border'
            #    padding: 5

            collapsible: false
            floatable: false
            split: false
            frame:false
            border:false
            bodyStyle: {
                background: 'transparent'
            }
            items: [
                {
                    xtype: 'toolbar'
                    cls: 'l-header'
                    items:  header_items
                }

                {
                    id: 'breadcrumb'
                    html: 'breadcrumb'
                }

                {
                    id: 'logo'
                    html: 'logo'
                }
            ]
                
        @callParent(arguments)
        return @
    afterRender: ->
        @callParent(arguments)
        #TODO
