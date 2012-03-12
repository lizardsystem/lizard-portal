/**
 * Created by PyCharm.
 * User: bastiaanroos
 * Date: 18-10-11
 * Time: 15:33
 * To change this template use File | Settings | File Templates.
 */
{% load get_portal_template %}

{
    itemId: 'homepage',
    title: 'Watersysteemkaart',
    breadcrumbs: [
        {
            name: 'watersysteemkaart'
        }
    ],
	xtype: 'portalpanel',
	items: [{
		width: 300,
		items: [
            {% get_portal_template gebiedseigenschappen %},
            {% get_portal_template communique %},
        {
            xtype: 'workspaceportlet',
            workspaceStore: Lizard.store.WorkspaceStore.get_or_create('watersysteem'),
            tools:[]
        }]
	},{
		flex: 1,
		items: [{
			title: 'Watersysteemkaart',
            flex:1,
            xtype: "mapportlet",
            initZoomOnRender: false,
            autoLoadWorkspaceStore: {
                id: 2
            },
            init_workspace: false,
            controls: [new OpenLayers.Control.LayerSwitcher()
            ],
            workspaceStore: Lizard.store.WorkspaceStore.get_or_create('watersysteem'),
            onApplyParams: function(params) {
                var me = this;
                me.setLoading(true);
                if (!this.init_workspace && this.autoLoadWorkspaceStore) {
                    this.workspaceStore.load({
                         params: this.autoLoadWorkspaceStore,
                         callback: function(records) {

                             if (records.length > 0) {
                                 me.workspaceStore.workspaceItemStore.loadData(records[0].get('layers'))
                             }
                         }
                    });
                    this.init_workspace = true
                }

                Ext.Ajax.request({
                    url: '/area/api/area_special/'+ params.object.id +'/',
                    method: 'GET',
                    params: {
                        _accept: 'application/json'
                    },
                    success: function(xhr) {
                        var area_data = Ext.JSON.decode(xhr.responseText).area;
                        me.default_zoom = area_data.extent
                        me.map.zoomToExtent(new OpenLayers.Bounds.fromArray(area_data.extent));
                        return me.setLoading(false);
                    },
                    failure: function() {
                        Ext.Msg.alert("portal creation failed", "Server communication failure");
                        return me.setLoading(false);
                    }
                });
            }
		}]
	},{
		width: 200,
		items: [{
            title: 'Links van dit gebied',
            layout: {
                type: 'table',
                columns:1
            },
            height: 200,
            defaults:{
                width:160,
                xtype:'button',
                margin: 3
            },
            items:[{
                    text: 'Ecologische sleutelfactoren',
                    icon: '/static_media/vss/icons/esf.png',
                    handler: function() { Lizard.CM.setContext({portal_template:'esf-1'}); }
                }, {
                   text: 'Waterbalansen',
                   icon: '/static_media/vss/icons/waterbalansen.png',
                   handler: function() { Lizard.CM.setContext({portal_template:'waterbalans'}); }
                }, {
                   text: 'Analyse interpretaties',
                   icon: '/static_media/vss/icons/advies.png',
                   handler: function() { Lizard.CM.setContext({portal_template:'analyse-interpretatie'}); }
                }, {
                   text: 'Geschikte maatregelen',
                   icon: '/static_media/vss/icons/gebiedsinformatie.png',
                   handler: function() { Lizard.CM.setContext({portal_template:'advies'}); }
                }, {
                   text: 'Maatregelen',
                   icon: '/static_media/vss/icons/maatregelen.png',
                   handler: function() { Lizard.CM.setContext({portal_template:'maatregelen'}); }
                }, {
                   text: 'Toestand',
                   icon: '/static_media/vss/icons/toestand.png',
                   handler: function() { Lizard.CM.setContext({portal_template:'toestand-aan-afvoergebied'}); }
                }
            ]
 		},
        {% get_portal_template esf-overzicht %},
        {% get_portal_template gebieden_links %}
       ]
    }]
}
