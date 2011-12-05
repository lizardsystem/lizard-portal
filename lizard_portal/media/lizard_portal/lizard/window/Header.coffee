Ext.define('Lizard.window.Header', {
    extend:'Ext.panel.Panel'
    alias: 'widget.pageheader'
    config:
        headertabs: []
        context_manager: {}
        logo_url: '/static_media/vss/stowa_logo.png'
        portalWindow: null

    setBreadCrumb:(bread_crumbs) ->
        #bread_crumbs = bread_crumbs[0]

        me = @
        bread_div = @breadcrumb.el
        bread_div.dom.innerHTML = ''

        portalWindow = @portalWindow

        element = {
            tag: 'div',
            cls: 'link',
            html: '> ' + portalWindow.context_manager.getContext().object
        }

        bread_div.createChild(element)
        el = bread_div.last()
        el.addListener('click',
            () ->
               portalWindow.showNavigationPortalTemplate()
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
                            portalWindow.linkTo({portalTemplate: crumb_l.link})
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


    updateContextHeader: () ->
        context = @context_manager.getContext()

        html = ''
        if context.object_type
            html += context.object_type + '<br>'

        if context.object_name
            html += context.object_name

        @contextheader.body.dom.innerHTML = html


    logout: () ->
        Ext.MessageBox.confirm(
            'Loguit',
            'Weet u zeker dat u uit wil loggen?',
            (button) ->
                if button == 'yes'
                    location.replace('/user/logout_redirect/?url='+location.href)
        )

    login: () ->
        Ext.create('Ext.window.Window', {

            title: 'Login'
            items:
                frame: true
                xtype: 'form'
                url:'/user/login_redirect/'
                bodyStyle: 'padding:5px 5px 0',
                width: 350,
                fieldDefaults:
                    msgTarget: 'side',
                    labelWidth: 90
                defaultType: 'textfield',
                defaults:
                    anchor: '100%'

                items: [
                    {
                        fieldLabel: 'Gebruikernaam'
                        name: 'username'
                    }
                    {
                        fieldLabel: 'Password'
                        name: 'password'
                        inputType: 'password'
                    }
                    {
                        xtype: 'displayfield',
                        value: 'Wachtwoord <a href="' + url.auth_password_reset + '" target="_blank">vergeten</a> of <a href="' + url.auth_password_reset + '" target="_blank">wijzigen</a>?'
                    }
                ]

                buttons: [{
                    text: 'Login'
                    formBind: true,
                    handler: () ->
                        form = @up('form').getForm()

                        form.submit({
                            clientValidation: true
                            url: form.url
                            success: (form, action) ->
                                result = Ext.JSON.decode(action.response.responseText)
                                if result.success
                                    location.reload()
                                else
                                    Ext.Msg.alert('Fout', result.msg)

                            failure: (form, action) ->
                                result = Ext.JSON.decode(action.response.responseText)
                                Ext.Msg.alert('Fout', result.msg)
                        })


                },{
                    text: 'Cancel'
                    handler: () ->
                        window = @up('window')
                        window.close()
                }]
        }).show()

    constructor: (config) ->
        @initConfig(config)
        @callParent(arguments)

    initComponent: () ->
        me = @

        print_object = (obj) ->
            output = ""
            Ext.Object.each(obj,(key, value) ->
                if typeof(value) == 'object'
                    output += key + ":<br>"
                    Ext.Object.each(value,(key2, value2) ->
                        output += '....' + key2 + ": " + value2 + "<br>"
                    )
                else
                    output += key + ": " + value + "<br>"
            )
            return output

        header_items = [
            { xtype: 'tbspacer', width: 200 },
            '->'
        ]
        tabs = @getHeadertabs()
        active_tab = @context_manager.getActive_headertab()
        console.log('headers:')
        for tab in tabs
            if active_tab == tab
                pressed = true
            else
                pressed = false

            console.log(tab)

            header_items.push({
                id: 'headertab_' + tab.name
                text: tab.title
                pressed: pressed
                xtype: 'button'
                cls: 'l-headertab'
                toggleGroup: 'headertab'
                navigation: tab.navigation
                tab: tab
                handler: () ->
                    console.log arguments
                    me.portalWindow.navigation.setNavigation(@navigation)
                    me.context_manager.setActiveHeadertab(@tab)
                    context = me.context_manager.getContext()

                    if context.object_id
                        #show selected or default template
                        me.portalWindow.linkTo({})
                    else
                        me.portalWindow.showNavigationPortalTemplate()
            })

        header_items.push('->')

        user = @context_manager.getUser()

        if user.id == null
            header_items.push({
                text: 'Login',
                xtype: 'button'
                handler: (button, event, eOpts) ->
                    me.login()
                componentCls: 'l-headertabs'
            })
        else
            header_items.push(
                {
                    text: user.name
                    xtype: 'button'
                    componentCls: 'l-headertabs'
                    menu: [{
                            text: 'Instellingen'
                            handler: (button, event, eOpts) ->
                                Ext.MessageBox.alert('release 2', 'release2')
                        },
                        {
                            text: 'Toon huidige context'
                            handler: (button, event, eOpts) ->
                                Ext.MessageBox.alert('release 2', print_object(me.context_manager.getContext()))
                        }
                        '-'
                        {
                            text: 'Log uit'
                            handler: (button, event, eOpts) ->
                                me.logout()
                        }
                    ]
                    listeners:
                        mouseover:
                            fn: (button, event, eOpts) ->
                                console.log('over user')

                }
                '-'
                {
                    iconCls: 'settings'
                    xtype: 'button'
                    bodyCls: 'l-headertab'
                }
            )

        Ext.apply @,
            collapsible: false
            floatable: false
            split: false
            frame:false
            border:false
            bodyStyle:
                background: 'transparent'
            layout:'absolute',
            layoutConfig:
                #layout-specific configs go here
                itemCls: 'l-headertab'
            items: [
                {
                    x: 20,
                    y: 30,
                    height:25
                    border: false
                    id: 'contextheader'
                    bodyStyle:
                        'padding-right':'10px'
                        background: 'transparent'
                        'text-align':'right'
                        'font-size': '9px'
                        color: '#555'
                    html:'watersysteem<br>polderX'
                }

                {
                    x: 0,
                    y: 0,

                    xtype: 'toolbar'
                    cls: 'l-header'
                    items:  header_items
                }
                {
                    x: 250,
                    y: 20,
                    id: 'breadcrumb'
                    cls: 'breadcrumb'
                    height:15
                    border: false
                    bodyStyle:
                        background: 'transparent'
                        display: 'inline'
                    html: ''
                }
                {
                    x: 5,
                    y: 5,
                    width:200
                    height:45
                    border: false
                    bodyStyle:
                        background: 'transparent'
                    id: 'logo'
                    html:'<img src="' + me.getLogo_url() + '"></img>'
                }

            ]

        @callParent(arguments)

        @breadcrumb = Ext.getCmp('breadcrumb')
        @contextheader = Ext.getCmp('contextheader')

        return @


})
