{% load get_portal_template %}

{
    itemId: 'analyse',
    title: 'Analyse scherm',
    xtype: 'portalpanel',
    items:[{
	    width: 300,

        items: [{
            title: 'Navigatie',
            flex:2,
            xtype: 'tabpanel',
            loadTab: function (tab_id) {
                var tab = this.child(tab_id);
                this.setActiveTab(tab);

            },
            items:[{
                title: 'apps',
                xtype: 'appscreenportlet',
                start_appscreen_slug: 'krw-volg-en-stuursysteem',
                store: Ext.create('Lizard.store.Apps'),
                workspaceItemStore: Ext.data.StoreManager.lookup('WorkspaceItems')
            }]
        },{
            xtype: 'workspaceportlet',
            store: Ext.data.StoreManager.lookup('WorkspaceItems')
        }]

    },{
	    flex: 1,
		items: [{
			title: 'Kaart',
            id:'extmap_analyse',
            plugins: [
                'applycontext'
            ],
            flex:1,
            xtype: "mapportlet",
            initZoomOnRender: false,
            controls: [new OpenLayers.Control.LayerSwitcher()
            ],
            layers: Ext.data.StoreManager.lookup('WorkspaceItems'),

            applyParams: function(params) {
                var me = this;
                me.setLoading(true);
                Ext.Ajax.request({
                    url: '/area/api/area_special/'+ params.object.id +'/',
                    method: 'GET',
                    params: {
                        _accept: 'application/json'
                    },
                    success: function(xhr) {
                        var area_data = Ext.JSON.decode(xhr.responseText).area;
                        me.map.zoomToExtent(new OpenLayers.Bounds.fromArray(area_data.extent));
                        return me.setLoading(false);
                    },
                    failure: function() {
                        Ext.Msg.alert("portal creation failed", "Server communication failure");
                        return me.setLoading(false);
                    }
                });
            },
            rbar:[{
                    //text: 'ESF',
                    icon: '/static_media/vss/icons/esf.png',
                    handler: function() { Ext.getCmp('portalWindow').linkToNewWindow({portal_template:'esf-1'}); }
                }, {
                   //text: 'WB',
                   icon: '/static_media/vss/icons/waterbalansen.png',
                   handler: function() { Ext.getCmp('portalWindow').linkToNewWindow({portal_template:'waterbalans'}); }
                },/* {
                   text: 'AI',
                   handler: function() { Ext.getCmp('portalWindow').linkToNewWindow({portalTemplate:'analyse-interpretatie'}); }
                }, {
                   text: 'Advies',
                   handler: function() { Ext.getCmp('portalWindow').linkToNewWindow({portalTemplate:'advies'}); }
                },*/ {
                   //text: 'Maatr',
                   icon: '/static_media/vss/icons/maatregelen.png',
                   handler: function() { Ext.getCmp('portalWindow').linkToNewWindow({portal_template:'maatregelen'}); }
                }, {
                   text: 'Tsnd',
                   handler: function() { Ext.getCmp('portalWindow').linkToNewWindow({porta_template:'toestand-aan-afvoergebied'}); }
                }],
            flex:1
		}]
	}]
}
