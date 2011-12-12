
{
    itemId: 'toestand-aan-afvoergebied',
    title: 'Toestand',
    breadcrumbs: [
        {
            name: 'watersysteemkaart'
        },
        {
            name: 'Toestand'
        }
    ],
	xtype: 'portalpanel',
	items: [{
    	width: 200,
		items: [{
            {
			title: 'Gebiedsinformatie',
            flex:1,
            plugins: [
                'applycontext'
            ],
            autoScroll: true,
            tpl: new Ext.XTemplate(
                '<p><table class="l-grid"> ',
                '<tpl for=".">',       // process the data.kids node
                '<tr class="l-row"><td>{name}<td>{value}</tr>',  // use current array index to autonumber
                '</tpl><table class="l-grid"></p>'
            ),
            loader: {
                ajaxOptions: {
                    method: 'GET'
                },
                loadMask: true,
                url: '/area/api/property/',
                autoLoad: false,
                 baseParams: {
                     _accept: 'application/json'
                 },
                renderer: 'data'
            },
            applyParams: function(params) {
                 var me = this;
                 me.getLoader().load({
                     params: {
                         object_id: params.object_id
                     }
                 });
            }

		},
            {
			title: 'Communique',
            id: 'communique',
            bodyCls: 'l-grid',
            height: 150,
            //flex:1,
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
           },
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
                                                Ext.getCmp('communique').applyParams({
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
             }]
		},
        {
            title: 'ESF-scores',
            html: 'esf scores (GS300)',
            flex:1
        }]
    },{
		flex: 1,
		items: [{
			title: 'Grafieken',
            flex: 1,
            xtype: 'multigraph',
            graph_service_url: '/graph/',
            context_manager: Ext.getCmp('portalWindow').context_manager,
            graphs: [{
                title: 'Stuurparameter 1',
                params: {
                    item:[{
                        parameter: "N.belasting.kritisch",
                        //module: "ImportLE",
                        location: "SAP",
                        type: 'line',
                        layout: {color: 'red'}
                    },{
                        parameter: "P.belasting.kritisch",
                        //module: "ImportLE",
                        location: "SAP",
                        type: 'line',
                        layout: {color: 'blue'}
                    }]
                }
            },{
                title: 'Stuurparameter 2',
                params: {
                    item:[{
                        parameter: "N.belasting.kritisch",
                        //module: "ImportLE",
                        location: "SAP",
                        type: 'line',
                        layout: {color: 'red'}
                    },{
                        parameter: "P.belasting.kritisch",
                        //module: "ImportLE",
                        location: "SAP",
                        type: 'line',
                        layout: {color: 'blue'}
                    }]
                }
            },{
                title: 'EKR scores',
                link_to: {portalTemplate:'ekr-score'},
                params: {
                    item:[{
                        parameter: "N.belasting.kritisch",
                        //module: "ImportLE",
                        location: "SAP",
                        type: 'line',
                        layout: {color: 'red'}
                    },{
                        parameter: "P.belasting.kritisch",
                        //module: "ImportLE",
                        location: "SAP",
                        type: 'line',
                        layout: {color: 'blue'}
                    }]
                }
            }, {
                title: 'Maatregel voortgang',
                link_to: {portalTemplate:'maatregelen'},
                params: {
                    item:[]
                }
            }]
		}]

    },
    {
		width: 200,
		items: [{
            title: 'Links van dit gebied',
            layout: {
                type: 'table',
                columns:1
            },
            height: 250,
            defaults:{
                width:150,
                xtype:'button',
                margin: 2
            },
            items:[{
                    text: 'Ecologische sleutelfactoren',
                    handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'esf-overzicht'}); }
                }, {
                   text: 'Maatregelen',
                   handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'maatregelen'}); }
                }, {
                   text: 'Watersysteemkaart',
                   handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'homepage'}); }
                }
            ]
 		},{
			title: 'Gerelateerde deelgebieden',
            flex:1,
            autoScroll:true,
            layout: {
                type: 'table',
                columns:1
            },
            defaults:{
                width:150,
                xtype:'button'
            },
            items:[
            ]
		}]
    }]
}
