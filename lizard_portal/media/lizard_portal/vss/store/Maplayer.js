/**
 * Created by PyCharm.
 * User: bastiaanroos
 * Date: 24-10-11
 * Time: 14:43
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Vss.store.Maplayer', {
    extend: 'GeoExt.data.LayerStore',
    requires: ['GeoExt.data.LayerStore', 'Vss.model.Maplayer'],
    model: 'Vss.model.Maplayer',
    initComponent: function(arguments) {
        arguments = {
            layers: [new OpenLayers.Layer.OSM()]
        }

        GeoExt.data.LayerStore.superclass.initComponent.apply(this, arguments);
    }
});