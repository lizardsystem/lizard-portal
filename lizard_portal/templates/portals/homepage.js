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
                    width:35,
                    dataIndex: 'visibility',
                    xtype: 'checkcolumn',
                    sortable: true
                },{
                    text: 'Naam',
                    flex: 1,
                    sortable: true,
                    dataIndex: 'title'
                }],
            store: Ext.data.StoreManager.lookup('Layers')
		}]
	},{
		flex: 1,
		items: [{
			title: 'Watersysteemkaart',
            id:'extmap',
            flex:1,
            xtype: "gx_mappanel",
            controls: [new OpenLayers.Control.LayerSwitcher()
            ],
            extent: new OpenLayers.Bounds{{ area.extent }},
            layers: Ext.data.StoreManager.lookup('Layers')
//{layers: [new OpenLayers.Layer.OSM()], storeId: 'Layers'}

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
                {% if area.parent %}
                {
                    text: '{{area.parent.name}}',
                    handler: function() { Ext.getCmp('portalWindow').linkTo({area:"{{ area.parent.ident }}" }); }
                },
                {% endif %}

                {% for a in area.get_children %}
                {
                    text: '{{a.name}}',
                    handler: function() { Ext.getCmp('portalWindow').linkTo({area:"{{ a.ident }}" }); }
                },
                {% endfor %}
            ]
		}]
       }]
}