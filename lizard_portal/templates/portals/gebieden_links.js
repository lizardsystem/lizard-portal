{% load get_portal_template %}

{% if perms.appl_beheeder %}
{
    title: 'Gebieden links',
    flex:1,
    autoScroll: true,
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
                object_id: params.object.id
            }
        });
    },
    listeners:{
        click: {
            element: 'el',
            fn: function (event, element) {
                var params = {object:{}}
                var object_id_dom = element.attributes.getNamedItem('object_id')
                if (object_id_dom) {
                    params.object.id = object_id_dom.value
                }
                var template_dom = element.attributes.getNamedItem('template')
                if (template_dom) {
                    params.portal_template = template_dom.value
                }
                var object_type_dom = element.attributes.getNamedItem('object_type')
                if (object_type_dom) {
                    params.object.type= object_type_dom.value
                }
                var headertab_dom = element.attributes.getNamedItem('headertab')
                if (headertab_dom) {
                    params.headertab = headertab_dom.value
                }
                var object_name_dom = element.attributes.getNamedItem('object_name')
                if (object_name_dom) {
                    params.object.name = object_name_dom.value
                }
                console.log('switch')
                console.log(params)
                Ext.getCmp('portalWindow').linkTo(params);

            }
        }
    }
}
{% else %}
{% get_portal_template geen_toegang %}
{% endif %}