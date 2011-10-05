/**
 * Created by JetBrains WebStorm.
 * User: bastiaan.roos
 * Date: 23-7-11
 * Time: 16:37
 * To change this template use File | Settings | File Templates.
 */

Ext.define('Lizard.Window.Dashboard', {
    /** @readonly */
    extend:'Ext.container.Viewport',

    uses: ['Lizard.Portlet.Portlet',
        'Lizard.Portlet.PortalPanel',
        'Lizard.Portlet.PortalColumn',
        'Lizard.Portlet.GridPortlet',
        'Lizard.Portlet.ChartPortlet',
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
                // store: this.getStore(),
                store: this.getStore()
            },{
                region: 'center',
                collapsible: false,
                floatable: false,
                split: false,
                id: 'app-portal',
                xtype: 'portalpanel',
                items: [{
                    id: 'col-1',
                    columnWidthRel: .4,
                    items: [{
                        id: 'portlet-1',
                        title: 'Grid Portlet',
                        tools: this.getTools(),
                        items: Ext.create('Lizard.Portlet.GridPortlet'),
                        listeners: {
                            'close': Ext.bind(this.onPortletClose, this)
                        }
                    },{
                        id: 'portlet-2',
                        title: 'Portlet 2',
                        tools: this.getTools(),
                        html: content,
                        listeners: {
                            'close': Ext.bind(this.onPortletClose, this)
                        }
                    }]
                },{
                    id: 'col-2',
                    columnWidthRel: .2,
                    items: [{
                        id: 'portlet-3',
                        title: 'Portlet 3',
                        tools: this.getTools(),
                        html: '<div class="portlet-content">Hier moet iets komen</div>',
                        listeners: {
                            'close': Ext.bind(this.onPortletClose, this)
                        }
                    }]
                },{
                    id: 'col-3',
                    columnWidthRel: .4,
                    items: [{
                        id: 'portlet-4',
                        title: 'Stock Portlet',
                        tools: this.getTools(),
                        items: Ext.create('Lizard.Portlet.ChartPortlet'),
                        listeners: {
                            'close': Ext.bind(this.onPortletClose, this)
                    }
                    }]
                }]
            },{
                region: 'south',
                collapsed: true,
                height: 200,
                title: 'beheer',
                html: 'beheer/ instel/ ontwikkelschermen'
            }]
        });

        /**/

        //this.initConfig(config);
        //this.callParent();
        Lizard.Window.Dashboard.superclass.initComponent.apply(this, arguments);

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