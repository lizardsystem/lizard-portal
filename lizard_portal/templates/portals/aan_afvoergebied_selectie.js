/**
 * Created by PyCharm.
 * User: bastiaanroos
 * Date: 24-10-11
 * Time: 8:13
 * To change this template use File | Settings | File Templates.
 */
{
	xtype: 'portalpanel',
	items: [{
		flex: 1,
		items: [{
			title: 'Selecteer een aan/afvoer gebied',
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
                        user_workspace_id: 1,
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
            extent: new OpenLayers.Bounds(560169, 6814897, 616537, 6831609),
            //(4.7221503096837303, 52.097418937370598, 5.3054492200965404, 52.431493172200199)
            layers: [
                new OpenLayers.Layer.OSM(),
                new OpenLayers.Layer.WMS('gebieden', '/map/workspace/1/wms/',
                    {layers:'basic'}, {singleTile: true, displayOutsideMaxExtent: true, projection: new OpenLayers.Projection("EPSG:900913")})
            ]
		}]
    }]
}