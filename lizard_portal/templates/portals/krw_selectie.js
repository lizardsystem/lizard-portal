/**
 * Created by PyCharm.
 * User: bastiaanroos
 * Date: 24-10-11
 * Time: 8:13
 * To change this template use File | Settings | File Templates.
 */
{
    itemId: 'krw_selectie',
    title: 'KRW gebied selectie',
	xtype: 'portalpanel',
	items: [{
		flex: 1,
		items: [{
			title: 'Selecteer een KRW waterlichaam',
            flex: 1,
            xtype: "gx_mappanel",
            options: {
                projection: new OpenLayers.Projection("EPSG:900913"),
                units: "m"
            },
            controls: [new OpenLayers.Control.LayerSwitcher()
            ],
            onMapClick: function(event, lonlat) {
                console.log(event);
                console.log(lonlat);
                Ext.Ajax.request({
                    url: '/map/search_name/',
                    reader:{
                        type: 'json'
                    },
                    params: {
                        x: lonlat.lon,
                        y: lonlat.lat,
                        radius: 0,
                        epsg: 900913,
                        stored_workspace_id: 3,
                        format: 'object'
                    },
                    method: 'GET',
                    success: function(xhr, request) {
                        var areas = Ext.JSON.decode(xhr.responseText);
                        console.log(areas);;
                        Ext.getCmp('portalWindow').linkTo({object_id:areas[0].id.ident});
                    },
                    failure: function(xhr) {
                        alert('failure');

                    }

                });
            },
            extent: new OpenLayers.Bounds(500043, 6824175, 600557, 6871566),
            //(4.7221503096837303, 52.097418937370598, 5.3054492200965404, 52.431493172200199)
            layers: [
                new OpenLayers.Layer.OSM(),
                new OpenLayers.Layer.WMS('gebieden', '/map/workspace/3/wms/',
                    {layers:'basic'}, {transitionEffect: 'resize', singleTile: true, displayOutsideMaxExtent: true, projection: new OpenLayers.Projection("EPSG:900913")})
            ]
		}]
    }]
}