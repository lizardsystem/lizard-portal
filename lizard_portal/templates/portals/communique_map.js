/**
 * Created by PyCharm.
 * User: bastiaanroos
 * Date: 24-10-11
 * Time: 8:13
 * To change this template use File | Settings | File Templates.
 */
{
    title: 'Gebied',
    height: 200,
    xtype: "gx_mappanel",
    addDefaultControls: false,
    options: {
        projection: new OpenLayers.Projection("EPSG:900913"),
        units: "m"
    },
    plugins: [
        'applycontext'
    ],
    onApplyParams: function(params) {
        var me = this;


        //iets over zetten van parameter
    },
    extent: new OpenLayers.Bounds.fromArray(Lizard.CM.getContext().init_zoom),
    layers: [
        new OpenLayers.Layer.OSM(),
        new OpenLayers.Layer.WMS(
          'Gebieden',
          '/layers/wms/?',
          {
            layers:['vss:vss_area_polygon'],
            transparent: true,
            format: 'image/png'
          },
          {
            singleTile: false,
            opacity: 0.7,
            transitionEffect: 'resize',
            singleTile: true,
            displayOutsideMaxExtent: true,
            projection: new OpenLayers.Projection("EPSG:900913")
          }
        )
    ]
}