/**
 * Created by PyCharm.
 * User: bastiaanroos
 * Date: 18-10-11
 * Time: 15:33
 * To change this template use File | Settings | File Templates.
 */
 {
	xtype: 'portalpanel',
	items: [{
		width: 300,
		items: [{
			title: 'Overzichtskaart',
            height:200,
			items: {
                xtype: "image",
			    src: "http://test.krw-waternet.lizardsystem.nl/krw/summary/gaasterplas/tiny_map/"
            }
		},{
            flex:1,
			title: 'Kaartlagen',
            xtype: 'grid',
            columns:[{
                    text: 'aan',
                    width:25,
                    dataIndex: 'on',
                    xtype: 'checkcolumn',
                    sortable: true
                },{
                    text: 'Naam',
                    flex: 1,
                    sortable: true,
                    dataIndex: 'name'
                }],
            store: 'Vss.store.Maplayer'
		}]
	},{
		flex: 1,
		items: [{
			title: 'Watersysteemkaart',
            flex:1,
            xtype: "gx_mappanel",
            extent: new OpenLayers.Bounds{{ area.extent }},
            layers: [new OpenLayers.Layer.OSM()
                ]
		}]
	},{
		width: 250,
		items: [{
            title: 'Links van dit gebied',
            layout: {
                type: 'table',
                columns:1
            },
            defaults:{
                width:150,
                xtype:'button'
            },
            items:[{
                    text: 'Ecologische sleutelfactoren',
                    handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'esf-overzicht'}); }
                }, {
                   text: 'Waterbalansen',
                   handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'waterbalans'}); }
                }, {
                   text: 'Communique',
                   handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'communiques'}); }
                }, {
                   text: 'Analyse interpretaties',
                   handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'analyse-interpretatie'}); }
                }]
 		},{
			title: 'Gerelateerde deelgebieden',
            layout: {
                type: 'table',
                columns:1
            },
            defaults:{
                width:150,
                xtype:'button'
            },
            items:[{
                    text: 'Gebied A',
                    handler: function() { Ext.getCmp('portalWindow').linkTo({area:1}); }
                }, {
                    text: 'Gebied B',
                    handler: function() { Ext.getCmp('portalWindow').linkTo({area:2}); }
              }]
		}]
       }]
}