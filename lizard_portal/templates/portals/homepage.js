/**
 * Created by PyCharm.
 * User: bastiaanroos
 * Date: 18-10-11
 * Time: 15:33
 * To change this template use File | Settings | File Templates.
 */
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
            plugins: [
                'applycontext'
            ],
            flex:1,
            xtype: "gx_mappanel",
            controls: [new OpenLayers.Control.LayerSwitcher()
            ],
            layers: Ext.data.StoreManager.lookup('Layers'),
            onMapClick: function (event) {

                layerlist = "here,there,everywhere";

                mouseLoc = this.map.getLonLatFromPixel(event.xy);

                var url = this.map.layers[2].getFullRequestString({
                            namespace: 'inspire',
                            REQUEST: "GetFeatureInfo",
                            EXCEPTIONS: "application/vnd.ogc.se_xml",
                            BBOX: this.map.getExtent().toBBOX(),
                            X: event.xy.x,
                            Y: event.xy.y,
                            //X: mouseLoc.X,
                            //Y: mouseLoc.Y,
                            INFO_FORMAT: 'text/html',
                            QUERY_LAYERS: 'HY.PhysicalWaters.ManMadeObject',
                            LAYERS: 'HY.PhysicalWaters.ManMadeObject',
                            FEATURE_COUNT: 1,
                            WIDTH: this.map.size.w,
                            HEIGHT: this.map.size.h
                    },
                            "http://maps.waterschapservices.nl/wms?");

                Ext.create('Ext.window.Window', {
                        title: 'object_info',
                        width: 400,
                        height: 300,
                        //layout: 'fit',
                        autoScroll: true,
                        loader:{
                            load_mask: true,

                            autoLoad: true,
                            url: '/portal/getFeatureInfo/',
                            ajaxOptions: {
                                method: 'GET'
                            },
                            params: {
                                request: Ext.JSON.encode(url)
                            },
                            renderer: 'html'
                        }
                    }
                ).show();


            },
            applyParams: function(params) {
                var me = this;
                me.setLoading(true);
                Ext.Ajax.request({
                    url: '/area/api/area_special/'+ params.object_id +'/',
                    method: 'GET',
                    params: {
                        _accept: 'application/json'
                    },
                    success: function(xhr) {
                        var area_data = Ext.JSON.decode(xhr.responseText).area;
                        console.log(area_data)
                        me.map.zoomToExtent(new OpenLayers.Bounds.fromArray(area_data.extent));

                        return me.setLoading(false);
                    },
                    failure: function() {
                        Ext.Msg.alert("portal creation failed", "Server communication failure");
                        return container.setLoading(false);
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
            height: 150,
            defaults:{
                width:150,
                xtype:'button',
                margin: 2
            },
            items:[{
                    text: 'Ecologische sleutelfactoren',
                    handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'esf-overzicht'}); }
                }, {
                   text: 'Waterbalansen',
                   handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'waterbalans'}); }
                }, {
                   text: 'Communique',
                   handler: function() { Ext.getCmp('portalWindow').linkTo({portalTemplate:'communique'}); }
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