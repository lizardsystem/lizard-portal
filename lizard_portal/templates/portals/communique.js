{
			title: 'Communique',
            bodyCls: 'l-grid',
            height: 150,
            collapsed: false,
            collapsible: true,
            autoScroll: true,
            plugins: [
                'applycontext'
            ],
            tpl: new Ext.XTemplate(
                '<tpl for=".">',
                '<p>',
                '{[this.transform(values)]}',
                '</p>',
                '<hr></hr><p><i>{edited_by}, {edited_at}</i></p>',
                '</tpl>',
                {
                    transform: function(values) {
                        return values.description.replace(/\n/g, '<br>');
                    }
                }
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
                        object_id: params.object.id
                    }
                });
           }{% if user.is_authenticated %},
            tools: [{
                type: 'save',
                handler: function(e, target, panelHeader, tool){
                    console.log(arguments)
                    var portlet = panelHeader.up('panel')
                    var communique_data = portlet.data.description;

                    var form_window = Ext.create('Ext.window.Window', {
                        title: 'Bewerk communique',
                        width: 400,
                        height: 300,
                        constrain: true,
                        items: {
                            xtype: 'form',
                            url: '/area/api/area_communique/?_accept=application/json',
                            layout: 'anchor',
                            height: '100%',
                            defaults: {
                                anchor: '100%'
                            },
                            items: [{
                                xtype: 'hiddenfield',
                                name: 'object_id',
                                value: Lizard.CM.getContext().object.id
                            },{
                                xtype: 'textareafield',
                                //fieldLabel: 'First Name',
                                height: '100%',
                                name: 'description',
                                value: communique_data,
                                allowBlank: false
                            }],
                            buttons: [{
                                text: 'Annuleren',
                                handler: function(button, ev) {
                                    console.log(arguments)
                                    button.up('window').close();
                                }
                            },{
                                text: 'Reset',
                                handler: function(button, ev) {
                                    console.log(arguments)
                                    button.up('form').getForm().reset();
                                }
                            }, {
                                text: 'Opslaan',
                                formBind: true, //only enabled once the form is valid
                                //disabled: true,
                                handler: function() {
                                    var form = this.up('form').getForm();
                                    if (form.isValid()) {
                                        form.submit({
                                            success: function(form, action) {
                                                console.log('Opslaan gelukt');
                                                portlet.applyParams({
                                                       object: {
                                                           id:Lizard.CM.getContext().object.id
                                                       }
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
