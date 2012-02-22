{
    title: 'Gebieden links',
    flex:1,
    plugins: [
        'applycontext'
    ],
    loader: {
        ajaxOptions: {
            method: 'GET'
        },
        loadMask: true,
        renderer: 'html'
    },
    applyParams: function(params) {
        var me = this;
        me.url = '/area/area_links_panel/'
        me.getLoader().load({
            url: me.url,
            params: {
                object_id: params.object_id
            }
        });
    },
    listeners:{
        click: {
            element: 'el',
            fn: function (event, element) {
                var params = {}
                var object_dom = element.attributes.getNamedItem('object_id')
                if (object_dom) {
                    params.object_id = object_dom.value
                }
                var template_dom = element.attributes.getNamedItem('template')
                if (template_dom) {
                    params.portalTemplate = template_dom.value
                }
                var area_type_dom = element.attributes.getNamedItem('object_type')
                if (area_type_dom) {
                    params.object_type= area_type_dom.value
                }
                var headertab_dom = element.attributes.getNamedItem('headertab')
                if (headertab_dom) {
                    params.headerTab= headertab_dom.value
                }
                console.log('switch')
                console.log(params)
                Ext.getCmp('portalWindow').linkTo(params);

            }
        }
    }
}