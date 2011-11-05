/**
 * Created by PyCharm.
 * User: bastiaanroos
 * Date: 5-11-11
 * Time: 13:21
 * To change this template use File | Settings | File Templates.
 */

Ext.define('Lizard.ux.ImageResize', {
    extend: 'Ext.Img',
    alias: 'widget.imageResize',
    config: {
        params: {}
    },

    applyParams: function(new_params) {
        var url = this.orig_src

        var params = Ext.merge(this.params, new_params);

        for (key in params) {
            url += '&' + key + '=' + Ext.JSON.encode(params[key]);
        }

        this.setSrc(url);
    },

    constructor: function(config) {
        this.initConfig(arguments);
        this.callParent(arguments);
    },
    initComponent: function() {

        Ext.apply(this,{
            //orig_src: '/map/adapter/adapter_fewsnorm/image/?adapter_layer_json={%22module_id%22:%20null,%20%22parameter_id%22:%20%22ALMR110%22,%20%22fews_norm_source_slug%22:%20%22%22}&identifier={%22parameter_id%22:%20%22ALMR110%22,%20%22module_id%22:%20%22ImportLE%22,%20%22ident%22:%20%2253R0017%22}'
        });

        this.on({
            resize: function(Component, adjWidth, adjHeight, eOpts) {
                Component.applyParams({width: adjWidth, height: adjHeight});
            }
        })

        this.callParent(arguments);
    },
    afterRender: function() {
        this.applyParams({width: this.getWidth(), height: this.getHeight()});
    }


});
