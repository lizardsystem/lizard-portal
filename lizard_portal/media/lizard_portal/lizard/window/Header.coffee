Ext.define('Lizard.window.Header', {
    extend:'Ext.panel.Panel'
    alias: 'widget.pageheader'
    config:
        headertabs: []
        context_manager: {}
        logo_url: '/static_media/vss/stowa_logo.png'
        portalWindow: null
        close_on_logout:false

    setBreadCrumb:(bread_crumbs) ->
        #bread_crumbs = bread_crumbs[0]

        me = @
        bread_div = @breadcrumb.el
        bread_div.dom.innerHTML = ''

        portalWindow = @portalWindow


        context = portalWindow.context_manager.getContext()
        area_name = context.active_headertab.name || 'tab'

        element = {
            tag: 'div',
            cls: 'link',
            html: '> ' + area_name
        }

        bread_div.createChild(element)
        el = bread_div.last()
        el.addListener('click',
            () ->
               me.context_manager.setContext({portalTemplate:null})
               portalWindow.showTabMainpage()
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

        if context.object_name
            html += context.object_name + ' (' + context.object_id +  ')<br>'
        else if context.object_id
            html += ' (' + context.object_id +  ')<br>'

        html += Ext.Date.format(context.period_start, 'd-m-Y') + ' t/m ' + Ext.Date.format(context.period_end, 'd-m-Y')
        @contextheader.body.dom.innerHTML = html


    logout: () ->
        me = @
        Ext.MessageBox.confirm(
            'Loguit'
            'Weet u zeker dat u uit wil loggen?'
            (button) ->
                if button == 'yes'
                    location.replace('/user/logout_redirect/')
        )

    login: () ->

        #function which does actually log user in
        #login procedure has two steps:
        # 1) check username and password using ajax (and check=true parameter)
        # 2) login using a 'real' html submit using a real form. This way the browser will popup for remembering the
        #    username and password the next time
        #
        #after creation of the login window, the values for username and password are copied from a html form, which
        #already exist during creation of the page (is nescessary for the browser). see more details on:
        #http://www.sencha.com/forum/showthread.php?6450-Saved-user-credentials-and-dynamic-forms-possible
        log_me_in = (form) ->
            console.log('submit login')
            basic = form.getForm()

            form.submit({
                clientValidation: true
                url: form.url
                params: {
                    check: true #send parameter check to just check username and password and not sign in
                }
                success: (form, action) ->
                    result = Ext.JSON.decode(action.response.responseText)
                    if result.success
                        #when username and password are correct, login using the html form to prompt 'remember password'
                        Ext.get('username').dom.value = basic.findField('username').getValue()
                        Ext.get('password').dom.value = basic.findField('password').getValue()
                        document.forms["loginform"].submit()
                    else
                        Ext.Msg.alert('Fout', result.msg)

                failure: (form, action) ->
                    result = Ext.JSON.decode(action.response.responseText)
                    Ext.Msg.alert('Fout', result.msg)
            })

        login_window = Ext.create('Ext.window.Window', {
            id: 'login_window'
            title: 'Login'
            items:
                frame: true
                xtype: 'form'
                url:'/user/login_redirect/'
                bodyStyle: 'padding:5px 5px 0',
                width: 350,
                standardSubmit: false, #first check username and passwords using Ajax
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
                        allowBlank:false
                    }
                    {
                        fieldLabel: 'Password'
                        name: 'password'
                        inputType: 'password'
                        allowBlank:false
                    }
                    {
                        xtype: 'displayfield',
                        value: 'Wachtwoord <a href="' + url.auth_password_reset + '" target="_blank">vergeten</a>?'
                    }
                ]
                buttons: [{
                    id: 'login_button'
                    text: 'Login'
                    formBind: true,
                    handler: () ->
                        form = @up('form')
                        log_me_in(form)
                },{
                    text: 'Cancel'
                    handler: () ->
                        window = @up('window')
                        window.close()
                }]
        }).show()

        #get values from already existing fields in html-page
        basic = login_window.down('form').getForm()
        basic.findField('username').setValue(Ext.get('username').dom.value)
        basic.findField('password').setValue(Ext.get('password').dom.value)

        #set Enter on login button
        new Ext.util.KeyMap(login_window.getEl(),
            {
                key: Ext.EventObject.ENTER
                fn: () ->
                    form = login_window.down('form')
                    log_me_in(form)
            }
        )

    periodSelection: () ->
        Ext.create('Ext.window.Window', {

            title: 'Periode selectie'
            items:
                frame: true
                xtype: 'form'
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
                        xtype: 'radiogroup',
                        name: 'period_selection',
                        id: 'ps'
                        fieldLabel: 'Periode',
                        columns: 3,
                        vertical: false,
                        items: [
                            { boxLabel: 'dg', name: 'period', inputValue: 0, dt: [Ext.Date.DAY,-1]},
                            { boxLabel: '2dg', name: 'period', inputValue: 1, dt: [Ext.Date.DAY,-2] },
                            { boxLabel: 'wk', name: 'period', inputValue: 2, dt: [Ext.Date.DAY,-7] },
                            { boxLabel: 'mnd', name: 'period', inputValue: 3, dt: [Ext.Date.MONTH,-1] },
                            { boxLabel: 'jr', name: 'period', inputValue: 4, dt: [Ext.Date.YEAR,-1] },
                            { boxLabel: '5jr', name: 'period', inputValue: 5, dt: [Ext.Date.YEAR,-5] },
                            { boxLabel: 'anders', name: 'period', inputValue: 6, checked: true }
                        ]
                        listeners:
                            change: (field, new_value, old_value, optional) ->
                                selected = field.getChecked()[0]
                                form = field.up(form).getForm()
                                if new_value != 6
                                    form.findField('period_start').setValue(Ext.Date.add(new Date(), selected.dt[0], selected.dt[1]))
                                    form.findField('period_end').setValue(new Date())

                    }
                    {
                        xtype: 'datefield',
                        fieldLabel: 'van'
                        name: 'period_start'
                        format: 'd-m-Y',
                    }
                    {
                        xtype: 'datefield',
                        fieldLabel: 't/m'
                        name: 'period_end'
                        format: 'd-m-Y',
                    }
                ]

                buttons: [{
                    text: 'Ok'
                    formBind: true,
                    handler: () ->
                        form = @up('form').getForm()
                        #todo
                        console.log('form:')
                        if form.isValid()
                            values = form.getValues()
                            console.log(values)
                            Ext.getCmp('portalWindow').context_manager.setContext({
                                period_start: values.period_start
                                period_end: values.period_end
                                period: {
                                    selection: values.period
                                }
                            })
                            window = @up('window')
                            window.close()

                },{
                    text: 'Cancel'
                    handler: () ->
                        window = @up('window')
                        window.close()
                }]
                afterRender: () ->
                     form = @getForm()
                     ps = form.findField('period_selection')
                     context = Ext.getCmp('portalWindow').context_manager.getContext()
                     form.findField('period_start').setValue(context.period_start)
                     form.findField('period_end').setValue(context.period_end)
                     ps.setValue({period:context.period.selection})
        }).show()


    showContext: () ->
        #todo, deze mooier maken

        string_of_object = (obj) ->
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

        Ext.MessageBox.alert('Context overzicht', print_object(me.context_manager.getContext()))


    constructor: (config) ->
        @initConfig(config)
        @callParent(arguments)

    initComponent: () ->
        me = @

        header_items = [
            { xtype: 'tbspacer', width: 200 },
            '->'
        ]
        tabs = @getHeadertabs()
        active_tab = @context_manager.getActive_headertab()
        for tab in tabs
            if active_tab == tab
                pressed = true
            else
                pressed = false

            #todo, do not unpress button
            header_items.push({
                id: 'headertab_' + tab.name
                text: tab.title
                pressed: pressed
                xtype: 'button'
                cls: 'l-headertab'
                toggleGroup: 'headertab'
                headertab:tab
                handler: () ->

                    me.context_manager.setActiveHeadertab(@headertab)
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
                                me.showContext()
                        }
                        '-'
                        {
                            text: 'Andere gebruiker'
                            handler: (button, event, eOpts) ->
                                me.login()
                        }
                        {
                            text: 'Log uit'
                            handler: (button, event, eOpts) ->
                                me.logout()
                        }
                    ]
                }
                '-'
                {
                    iconCls: 'l-icon-clock'
                    xtype: 'button'
                    bodyCls: 'l-headertab'
                    handler: () ->
                        me.periodSelection()
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
                    html:''
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
                    html:'<a href="/"><img src="' + me.getLogo_url() + '"></img></a>'
                }
            ]

        @portalWindow.context_manager.on('contextchange', (change, context, context_m) ->
            me.updateContextHeader()
        )

        @callParent(arguments)

        @breadcrumb = Ext.getCmp('breadcrumb')
        @contextheader = Ext.getCmp('contextheader')


        if @portalWindow.context_manager.getContext().user.id == null
            @login()

        return @
})
