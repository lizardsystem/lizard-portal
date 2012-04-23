#
#
#
#
#
#  todo:
#     - version information
#     - show context
#     - make area selection less vss specific (now hardcoded krw_waterlichaam and krw_aanafvoergebied

Ext.define('Lizard.window.Header', {
    extend:'Ext.panel.Panel'
    alias: 'widget.pageheader'
    config:
        headertabs: []
        context_manager: {}
        logo_url: '/static_media/vss/stowa_logo.png'
        portalWindow: null
        close_on_logout:false

    #////
    #  setBreadCrumb(bread_crumbs)
    #  function for setting breadcrumb
    #
    #  bread_crumbs: dictionary with name and link (name of portal_template)
    #////
    setBreadCrumb:(bread_crumbs) ->
        #bread_crumbs = bread_crumbs[0]

        me = @
        bread_div = @breadcrumb.el
        bread_div.dom.innerHTML = ''

        context = Lizard.CM.getContext()
        area_name = context.headertab.name || 'tab'

        element = {
            tag: 'div',
            cls: 'link',
            html: '> ' + area_name
        }

        bread_div.createChild(element)
        el = bread_div.last()
        el.addListener('click',
            () ->
               me.context_manager.setContext({portal_template:null})
               me.portalWindow.showTabMainpage()
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
                            me.portalWindow.linkTo({portal_template: crumb_l.link})
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

    #////
    #  updateContextPeriodHeader()
    #  updates part in header which shows period
    #
    #
    #////
    updateContextPeriodHeader: (context) ->
        html = ''
        html += Ext.Date.format(context.period.start, 'd-m-Y') + '-<br>' + Ext.Date.format(context.period.end, 'd-m-Y') + ' '
        if @contextheader_period
            @contextheader_period.el.dom.innerHTML = html

    #////
    #  updateContextAreaHeader()
    #  updates part in header which shows selected
    #
    #
    #////
    updateContextAreaHeader: (context) ->
        html = ''

        if Lizard.CM.objects.krw_waterlichaam
            obj_str = Lizard.CM.objects.krw_waterlichaam.name + ' (' + Lizard.CM.objects.krw_waterlichaam.id +  ')'
            if 'krw_waterlichaam' in Lizard.CM.getContext().headertab.object_types
                obj_str = '<b>' + obj_str + '</b>'
            html += obj_str

        html += '<br>'

        if Lizard.CM.objects.aan_afvoergebied
            obj_str=  Lizard.CM.objects.aan_afvoergebied.name + ' (' + Lizard.CM.objects.aan_afvoergebied.id +  ')'
            if 'aan_afvoergebied' in Lizard.CM.getContext().headertab.object_types
                obj_str = '<b>' + obj_str + '</b>'
            html += obj_str

        @contextheader_area.el.dom.innerHTML = html

    #////
    #  logout()
    #  logout user
    #
    #
    #////
    logout: () ->
        me = @
        Ext.MessageBox.confirm(
            'Loguit'
            'Weet u zeker dat u uit wil loggen?'
            (button) ->
                if button == 'yes'
                    window.onunload = null
                    location.replace('/user/logout_redirect/')
        )

    #////
    #  login()
    #  shows dialog for login of user
    #
    #  login procedure has two steps:
    #   1) check username and password using ajax (and check=true parameter)
    #   2) login using a 'real' html submit using a real form. This way the browser will popup for remembering the
    #      username and password the next time
    #
    #  after creation of the login window, the values for username and password are copied from a html form, which
    #  already exist during creation of the page (is nescessary for the browser). see more details on:
    #  http://www.sencha.com/forum/showthread.php?6450-Saved-user-credentials-and-dynamic-forms-possible
    #////
    login: () ->
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
                    window.onunload = null
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

    #////
    #  periodSelection()
    #  dialog with period selection
    #
    #  output: set period on the contextManager
    #////

    periodSelection: () ->
        windows = Ext.WindowManager.getBy((obj) ->
            if obj.is_period_selection
                return true
            else
                return false
        )

        if windows.length > 0
            Ext.WindowManager.bringToFront(windows[0])
        else
            Ext.create('Ext.window.Window', {
                title: 'Periode selectie'
                is_period_selection:true,
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
                            items: Lizard.CM.periods
                            listeners:
                                change: (field, new_value, old_value, optional) ->
                                    selected = field.getChecked()[0]
                                    form = field.up('form').getForm()
                                    if new_value.period != 0
                                        form.findField('period_start').setValue(Ext.Date.add(new Date(), selected.dt[0], selected.dt[1]))
                                        form.findField('period_end').setValue(new Date())
                                        form.findField('period_start').setDisabled(true)
                                        form.findField('period_end').setDisabled(true)
                                    else
                                        form.findField('period_start').setDisabled(false)
                                        form.findField('period_end').setDisabled(false)
                        }
                        {
                            xtype: 'datefield',
                            fieldLabel: 'van'
                            name: 'period_start'
                            format: 'd-m-Y'
                        }
                        {
                            xtype: 'datefield',
                            fieldLabel: 't/m'
                            name: 'period_end'
                            format: 'd-m-Y'
                        }
                    ]
                    buttons: [{
                        text: 'Ok'
                        formBind: true,
                        handler: () ->
                            form = @up('form').getForm()
                            if form.isValid()
                                start = form.findField('period_start').getValue()
                                end = form.findField('period_end').getValue()
                                if end > start
                                    #form.findField('period_start').setDisabled(false)
                                    #form.findField('period_end').setDisabled(false)
                                    values = form.getValues()
                                    console.log(values)
                                    Lizard.ContextManager.setContext({
                                        period_start: start
                                        period_end: end
                                        period: {
                                            type: values.period
                                            start: start
                                            end: end
                                        }
                                    })
                                    window = @up('window')
                                    window.close()
                                else
                                    Ext.MessageBox.alert('Invoer fout', 'Begin datum moet voor eind datum zijn.')

                            else
                                Ext.MessageBox.alert('Invoer fout', 'Kies geldige periode')

                    },{
                        text: 'Cancel'
                        handler: () ->
                            window = @up('window')
                            window.close()
                    }]
                    afterRender: () ->
                         form = @getForm()
                         ps = form.findField('period_selection')
                         context = Lizard.CM.getContext()
                         form.findField('period_start').setValue(context.period.start)
                         form.findField('period_end').setValue(context.period.end)
                         ps.setValue({period:context.period.type})
            }).show()


    showContext: () ->

        user = Lizard.CM.context.user

        output = ''
        output += 'naam: ' + user.name + '<br>';
        output += 'organisatie: ' + user.organization + '<br>';
        output += 'rechten:<br>'
        for group in user.groups
            output += '   ' + group + '<br>'

        if Lizard.CM.getContext().background_layer
            output += 'Achtergrond: ' + Lizard.CM.getContext().background_layer.title + '<br>'
        Ext.MessageBox.alert('Gebruikers informatie', output)


    constructor: (config) ->
        @initConfig(config)
        @callParent(arguments)

    initComponent: () ->
        me = @

        tabs = @getHeadertabs()
        context = Lizard.CM.context

        header_items = [
            { xtype: 'tbspacer', width: 200 },
            '->'
        ]

        active_tab = context.headertab
        for tab in tabs
            #set initial headertab
            if active_tab == tab
                pressed = true
            else
                pressed = false

            if tab.config.menu
                xtype = 'splitbutton'
                menu = tab.config.menu
            else
                xtype = 'button'
                menu = null

            header_items.push({
                id: 'headertab_' + tab.name
                text: tab.title
                pressed: pressed
                xtype: xtype
                menu: menu
                plain: true
                cls: 'l-headertab'
                toggleGroup: 'headertab'
                headertab:tab
                handler: () ->
                    if !@pressed
                        @toggle()
                    Lizard.CM.setContext({headertab:@headertab})
            })

        header_items.push('->')

        user = @context_manager.context.user

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
                            text: 'Over deze versie'
                            handler: (button, event, eOpts) ->
                                Ext.create('Ext.window.Window', {
                                    title: 'VSS'
                                    autoLoad:
                                        url: '/version/'
                                    width: 400,
                                    height: 100,
                                    modal: true,
                                }).show();
                        },
                        {
                            text: 'Toon informatie gebruiker'
                            handler: (button, event, eOpts) ->
                                me.showContext()
                        }
                        '-'
                        {
                            text: 'Andere gebruiker'
                            handler: (button, event, eOpts) ->
                                Lizard.CM.saveContext()
                                me.login()
                        }
                        {
                            text: 'Log uit'
                            handler: (button, event, eOpts) ->
                                Lizard.CM.saveContext()
                                me.logout()
                        }
                    ]
                }
                '-'
                {
                    id: 'contextheader_period'
                    cls: 'l-header-contextinfo'
                    html: ''
                    border: false
                    xtype: 'component'
                    width: 55
                }
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
                    x: 0,
                    y: 30,
                    width: '100%'
                    height:25
                    border: false
                    id: 'contextheader_area'
                    cls: 'l-header-contextinfo-area'
                    html:''
                    xtype: 'component'
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

        @portalWindow.context_manager.on('contextchange', (change, changed_objects, new_context, context_m) ->
            me._updateOnContextChange(change, changed_objects, new_context, context_m);

        )

        @callParent(arguments)

        @breadcrumb = Ext.getCmp('breadcrumb')
        @contextheader_area = Ext.getCmp('contextheader_area')
        @contextheader_period = Ext.getCmp('contextheader_period')

        if Lizard.CM.getContext().user.id == null
            @login()

        return @

    afterRender: () ->
        @callParent(arguments)

        context = Lizard.CM.getContext()
        @updateContextAreaHeader(context)
        @updateContextPeriodHeader(context)

    _updateOnContextChange: (change, changed_objects, new_context, context_m) ->
        @updateContextAreaHeader(new_context)
        @updateContextPeriodHeader(new_context)

        tab = Ext.getCmp('headertab_' + new_context.headertab.name)

        if !tab.pressed
            tab.toggle()

})
