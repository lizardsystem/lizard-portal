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
            height:300,
			items: {
                xtype: "image",
			    src: "http://test.krw-waternet.lizardsystem.nl/krw/summary/gaasterplas/tiny_map/"
            }
		},{
            flex:1,
			title: 'Kaartlagen'

		}]
	},{
		flex: 1,
		items: [{
			title: 'Watersysteemkaart',
            flex:1,
        //xtype: "gx_mappanel",
 /* center: new OpenLayers.LonLat(5, 45),
      layers: [new OpenLayers.Layer.WMS(
            "Global Imagery", "http://maps.opengeo.org/geowebcache/service/wms",
            {layers: "bluemarble"})],*/

        zoom: 1
		}]
	},{
		width: 250,
		items: [{
                        layout: {
                             type: 'table',
                             columns: 1
                        },
			title: 'Links van dit gebied',
                        items:[{
                              xtype:'button',
                              text: 'Ecologische sleutelfactoren',
                              width:100,
                              handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'esf-overzicht'}); }
                           }, {
                             xtype:'button',
                             text: 'Waterbalansen',
                             width:100,
                             handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'waterbalans'}); }
                          }, {
                             xtype:'button',
                             text: 'Communique',
                             width:100,
                             handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'communiques'}); }
                          }, {
                             xtype:'button',
                             text: 'Analyse interpretaties',
                             //width:100,
                             handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'analyse-interpretatie'}); }
                          }, {
                             xtype:'button',
                             text: 'Veldwaarnemingen en acties',
                             disabled:true,
                             //width:100,
                             handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'veldwaarneming_actie'}); }
                          }
                          ]
		},{
			title: 'Gerelateerde deelgebieden',
                        layout: {
                             type: 'table',
                             columns: 1
                        },
                        items:[{
                              xtype:'button',
                              text: 'Gebied A',
                              width:100,
                              handler: function() { Ext.getCmp('portalWindow').linkTo({}); }
                           }, {
                             xtype:'button',
                             text: 'Gebied B',
                             width:100,
                             handler: function() { Ext.getCmp('portalWindow').linkTo({}); }
                          }]
		}]
       }]
}