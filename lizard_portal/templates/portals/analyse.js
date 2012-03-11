
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
                workspaceStore: Lizard.store.WorkspaceStore.get_or_create('analyse')
            }]
        },{
            xtype: 'workspaceportlet',
            workspaceStore: Lizard.store.WorkspaceStore.get_or_create('analyse')
        }]
    },{
	    flex: 1,
		items: [{
			title: 'Kaart',
            flex: 1,
            xtype: "mapportlet",
            initZoomOnRender: false,
            controls: [new OpenLayers.Control.LayerSwitcher()],
            workspaceStore: Lizard.store.WorkspaceStore.get_or_create('analyse'),
            onApplyParams: function(params) {
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
                        me.default_zoom = area_data.extent;
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
                icon: '/static_media/vss/icons/esf.png',
                handler: function() { Ext.getCmp('portalWindow').linkToNewWindow({portal_template:'esf-1'}); }
            }, {
                icon: '/static_media/vss/icons/waterbalansen.png',
                handler: function() { Ext.getCmp('portalWindow').linkToNewWindow({portal_template:'waterbalans'}); }
            }, {
                icon: '/static_media/vss/icons/advies.png',
                handler: function() { Ext.getCmp('portalWindow').linkToNewWindow({portal_template:'analyse-interpretatie'}); }
            }, {
                icon: '/static_media/vss/icons/gebiedsinformatie.png',
                handler: function() { Ext.getCmp('portalWindow').linkToNewWindow({portal_template:'advies'}); }
            }, {
                icon: '/static_media/vss/icons/maatregelen.png',
                handler: function() { Ext.getCmp('portalWindow').linkToNewWindow({portal_template:'maatregelen'}); }
            }, {
                icon: '/static_media/vss/icons/toestand.png',
                handler: function() { Ext.getCmp('portalWindow').linkToNewWindow({portal_template:'toestand-aan-afvoergebied'}); }
            }]
		}]
	}]
}
