/**
 * Created by PyCharm.
 * User: bastiaanroos
 * Date: 5-11-11
 * Time: 13:21
 * To change this template use File | Settings | File Templates.
 */

Ext.define('Lizard.ux.ImageResize', {
    extend: 'Ext.Img',
    alias: 'widget.imageresize',
    config: {
        orig_src: '',
        params: {

        },
        link_to : null,
    },

    applyParams: function(new_params) {
        if (this.orig_src.indexOf('?') < 0 && this.orig_src.length > 0) {
            var url = this.orig_src + '?'
        } else {
            var url = this.orig_src;
        }
        
        var paramString = function(key, value) {
            if (Ext.type(params[key]) == 'object' || Ext.type(params[key]) == 'array') {
                return '&' + key + '=' + Ext.JSON.encode(value);
            } else {
                return '&' + key + '=' + value;
            }
        }

        var params = Ext.merge(this.params, new_params);

        for (key in params) {
            if (Ext.type(params[key]) == 'array') {
                for (var i=0; i<params[key].length; i++) {
                    url += paramString(key, params[key][i]);
                }
            } else {
                url += paramString(key, params[key]);
            }
        }
        // Before setting the new src, load a transparent dummy image
        // to reveal the spinning disk background image.
        this.setSrc('/static_media/lizard_portal/pixel.png');
        this.setSrc(url);
    },

    constructor: function(config) {
        this.initConfig(arguments);
        this.callParent(arguments);
    },
    initComponent: function() {
        var me = this;

        this.setSrc(this.src)
        this.addClass('loading')

        this.on({
            resize: function(Component, adjWidth, adjHeight, eOpts) {
                if (adjWidth && adjHeight) {
                    Component.applyParams({width: adjWidth, height: adjHeight});
                }
            }
        });

        if (this.link_to) {
            this.listeners = {
                click: {
                    element: 'el', //bind to the underlying el property on the panel
                    fn: function(){
                        Ext.getCmp('portalWindow').linkTo(me.link_to)
                    }
                }
            }
        }
        this.callParent(arguments);
    },
    afterRender: function() {
        this.callParent(arguments);
    }


});
