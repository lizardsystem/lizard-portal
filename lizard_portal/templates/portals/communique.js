{
			title: 'Communique',
            bodyCls: 'l-grid',
            height: 150,
            collapsed: true,
            autoScroll: true,
            plugins: [
                'applycontext'
            ],
             tpl: new Ext.Template(
                '<p>{data}</p>'
            ),
            loader: {
                ajaxOptions: {
                    method: 'GET'
                },
                loadMask: true,
                url: '/area/api/area_communique/',
                autoLoad: false,
                baseParams: {
                    _accept: 'application/json'
                },
                renderer: 'data'
            },
            applyParams: function(params) {
                var me = this;
                me.getLoader().load({
                    url: '/area/api/area_communique/',
                    params: {
                        object_id: params.object_id
                    }
                });
           }{% if perms.is_analyst %},
            tools: [{
                type: 'save',
                handler: function(e, target, panelHeader, tool){
                    console.log(arguments)
                    var portlet = panelHeader.up('panel')
                    var communique_data = portlet.data.data;
                    console.log(communique_data)

                    var form_window = Ext.create('Ext.window.Window', {
                        title: 'Bewerk communique',
                        width: 400,
                        height: 300,
                        items: {
                            xtype: 'form',
                            url: '/area/api/area_communique/',
                            layout: 'anchor',
                            height: '100%',
                            defaults: {
                                anchor: '100%'
                            },
                            items: [{
                                xtype: 'hiddenfield',
                                name: 'object_id',
                                value: Ext.getCmp('portalWindow').context_manager.getContext().object_id
                            },{
                                xtype: 'textareafield',
                                //fieldLabel: 'First Name',
                                height: '100%',
                                name: 'communique',
                                value: communique_data,
                                allowBlank: false
                            }],
                            buttons: [{
                                text: 'Reset',
                                handler: function(button, ev) {
                                    console.log(arguments)
                                    button.up('form').getForm().reset();
                                }
                            }, {
                                text: 'Submit',
                                formBind: true, //only enabled once the form is valid
                                //disabled: true,
                                handler: function() {
                                    var form = this.up('form').getForm();
                                    if (form.isValid()) {
                                        form.submit({
                                            success: function(form, action) {
                                                console.log('Opslaan gelukt');
                                                portlet.applyParams({
                                                       object_id: Ext.getCmp('portalWindow').context_manager.getContext().object_id
                                                });
                                                form.owner.up('window').close();

                                            },
                                            failure: function(form, action) {
                                                Ext.Msg.alert('Failed', 'Opslaan mislukt');
                                            }
                                        });
                                    }
                                }
                            }]
                         }
                    }).show();
                }
             }]{% endif %}
		}