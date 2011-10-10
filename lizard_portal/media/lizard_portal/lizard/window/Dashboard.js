/**
 * Created by JetBrains WebStorm.
 * User: bastiaan.roos
 * Date: 23-7-11
 * Time: 16:37
 * To change this template use File | Settings | File Templates.
 */

Ext.define('Lizard.window.Dashboard', {
    /** @readonly */
    extend:'Ext.container.Viewport',

    uses: ['Lizard.portlet.Portlet',
        'Lizard.portlet.PortalPanel',
        'Lizard.portlet.PortalColumn',
        'Lizard.portlet.GridPortlet',
        'Lizard.portlet.ChartPortlet',
        'Lizard.container.Header'
    ],

    config: {
        special: true
    },
    getStore: function() {
        return Ext.create('Ext.data.TreeStore', {
            proxy: {
                type: 'ajax',
                url: '/portal/example_treedata.json',
                extraParams: {
                    isJSON: true
                },
                reader: {
                    type: 'json'
                }
            },
            root: {
                expanded: true,
                children: [
                    { text: "Tekst A", leaf: true },
                    { text: "Tekst B", expanded: true, children: [
                        { text: "Tekst 2", leaf: true },
                        { text: "Tekst 3", leaf: true },
                        { text: "Tekst 4", leaf: false}
                    ]}
                ]
            }
        });
    },
	loadPortal: function () {
		//alert('load');
		var container = Ext.getCmp('app-portal');
		container.setLoading(true);
		container.removeAll();
		Ext.Ajax.request({
			url: '/portal/example_portal.json',
			// send additional parameters to instruct server script
			//params: {
			//	startDate: Ext.getCmp('start-date').getValue(),
			//	endDate: Ext.getCmp('end-date').getValue()
			//},
			// process the response object to add it to the TabPanel:
			success: function(xhr) {
				var newComponent = eval(xhr.responseText); // see discussion below
				container.add(newComponent); // add the component to the TabPanel
				container.setLoading(false);
			},
			failure: function() {
				Ext.Msg.alert("Grid create failed", "Server communication failure");
                container.setLoading(false);
			}
		});
	},
    initComponent: function(arguments) {
        var content = '<div class="portlet-content">hier moet iets komen</div>';
        
        Ext.apply(this, {
            layout: {
                type: 'border',
                padding:5
            },
            defaults: {
                collapsible: true,
                floatable: true,
                split: true,
                frame: true
            },
            items: [{
                region: 'north',
                collapsible: false,
                floatable: false,
                split: false,
                frame:false,
                border:false,
                height: 60
            },{
                region: 'west',
                xtype: 'treepanel',
                title: 'Navigatie',
                frame:false,
                width: 250,
                autoScroll: true,
                listeners: {
                    click: {
                        element: 'el', //bind to the underlying el property on the panel
                        fn: this.loadPortal
                    }
                },
                store: this.getStore(),
                bbar:[{
                    text: 'selecteer op kaart -->',
                    border:1,
                    handler: function() {
                        alert('laat nu kaart zien');
                    }
                }]
            },{
                region: 'center',
                collapsible: false,
                floatable: false,
                split: false,
                id: 'app-portal'
            }]
        });

        /**/

        //this.initConfig(config);
        //this.callParent();
        Lizard.window.Dashboard.superclass.initComponent.apply(this, arguments);

        return this;
    },
    onPortletClose: function(portlet) {
        this.showMsg('"' + portlet.title + '" was removed');
    },

    showMsg: function(msg) {
        var el = Ext.get('app-msg'),
            msgId = Ext.id();

        this.msgId = msgId;
        el.update(msg).show();

        Ext.defer(this.clearMsg, 3000, this, [msgId]);
    },

    clearMsg: function(msgId) {
        if (msgId === this.msgId) {
            Ext.get('app-msg').hide();
        }
    },

    getTools: function(){
        return [{
            xtype: 'tool',
            type: 'gear',
            handler: function(e, target, panelHeader, tool){
                var portlet = panelHeader.ownerCt;
                portlet.setLoading('Working...');
                Ext.defer(function() {
                    portlet.setLoading(false);
                }, 2000);
            }
        }];
    }

});