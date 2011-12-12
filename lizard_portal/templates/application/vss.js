{% load get_portal_template %}

Ext.Loader.setPath('Lizard', '{{ STATIC_URL }}lizard_portal/lizard');
Ext.Loader.setPath('Vss', '{{ STATIC_URL }}lizard_portal/vss');
Ext.Loader.setPath('GeoExt', '{{ STATIC_URL }}geoext4/src');


Ext.application({
    name: 'KRW_vss',
    models: [
        'Vss.model.Communique',
        'Vss.model.Esf',
        'Vss.model.ObjectTree',
        'Vss.model.PropertyGrid',
        'Vss.model.WaterbalanceBucket',
        'Vss.model.WaterbalanceStructure',
        'Vss.model.AnnotationDetail',
        'Vss.model.AnnotationDescription',
        'Vss.model.TimeserieObject'
    ],
    stores: [
        'Vss.store.Communique',
        'Vss.store.Esf',
        'Vss.store.CatchmentTree',
        'Vss.store.KrwGebiedenTree',
        'Vss.store.WaterbalanceAreaConfig',
        'Vss.store.WaterbalanceBucket',
        'Vss.store.WaterbalanceStructure',
        'Vss.store.WaterbalanceWaterConfig',
        'Vss.store.AnnotationDetail',
        'Vss.store.AnnotationDescription',
        'Vss.store.TimeserieObject'
    ],
    requires: [
        'Lizard.plugin.ApplyContext',
        'Ext.Img',
        // 'Ext.DomHelper',
        'Ext.grid.*',
        'Ext.grid.plugin.*',
        'Ext.data.Model',
        'Ext.data.StoreManager',
        'Ext.data.*',
        'Ext.tree.*',
        'Ext.form.*',
        'Ext.button.*',
        'Lizard.ux.CheckColumn',
        'Lizard.ux.CheckColumnTree',
        'Lizard.ux.VBoxScroll',
        'Lizard.ux.ImageResize',
        'GeoExt.panel.Map',
        'GeoExt.data.LayerStore',
        'GeoExt.data.LayerModel',
        'GeoExt.data.reader.Layer',
        'Ext.MessageBox',
        'Lizard.window.HeaderTab',
        'Lizard.window.ContextManager',
        'Lizard.grid.EditablePropertyGrid',
        'Lizard.form.ComboMultiSelect',
        'Lizard.grid.EditableGrid',
        'Lizard.store.EditGridStore',
        'Lizard.portlet.Portlet',
        'Lizard.portlet.PortalPanel',
        'Lizard.portlet.PortalColumn',
        'Lizard.portlet.GridPortlet',
        'Lizard.portlet.MultiGraph',
        'Lizard.window.Header',
        'Vss.grid.Esf'
    ],
    launch: function() {
        //TODO: for the time being on this location, a better location is the template of the watersystem portal

        Ext.require(["Ext.util.Cookies", "Ext.Ajax"], function(){
            // Add csrf token to every ajax request
            var token = Ext.util.Cookies.get('csrftoken');
            if(!token){
                Ext.Error.raise("Missing csrftoken cookie");
            } else {
                Ext.Ajax.defaultHeaders = Ext.apply(Ext.Ajax.defaultHeaders || {}, {
                    'X-CSRFToken': token
                });
            }
        });

        {% get_portal_template watersysteem_layers %}

        {% get_portal_template workspace_layers %}

        var headertabs = [
            Ext.create('Lizard.window.HeaderTab', {
                title: 'Beleid',
                name: 'beleid',
                navigation_portal_template: 'krw_selectie',
                default_portal_template: 'krw-overzicht',
                object_types: ['krw_waterlichaam'],
                navigation: {
                    id: 'select_krw_waterlichaam',
                    viewConfig: {
                        plugins: {
                            ptype: 'gridviewdragdrop',
                            dragGroup: 'firstGridDDGroup'
                        }
                    },
                    xtype: 'treepanel',
                    listeners: {
                        itemclick: {
                            fn: function (tree, node) {
                                //if not root
                                if (node.raw) {
                                    Ext.getCmp('portalWindow').linkTo({
                                        object_type: 'krw_waterlichaam',
                                        object_id: node.data.id,
                                        object_name: node.data.text});
                                } else {
                                    node.expand();
                                }
                            }
                        }
                    },
                    store: 'Vss.store.KrwGebiedenTree',
                    bbar: [{
                        text: 'Selecteer op kaart -->',
                        handler: function () {
                            Ext.getCmp('portalWindow').showNavigationPortalTemplate();
                        }
                    }]
                }
            }),
            Ext.create('Lizard.window.HeaderTab', {
                title: 'Watersysteem',
                name: 'watersysteem',
                navigation_portal_template: 'aan_afvoergebied_selectie',
                default_portal_template: 'homepage',
                object_types: ['aan_afvoergebied'],
                navigation: {
                    id: 'select_aan_afvoergebied',
                    viewConfig: {
                        plugins: {
                            ptype: 'gridviewdragdrop',
                            dragGroup: 'firstGridDDGroup'
                        }
                    },
                    xtype: 'treepanel',
                    listeners: {
                        itemclick: {
                            fn: function (tree, node) {
                                //if not root
                                if (node.raw) {
                                    Ext.getCmp('portalWindow').linkTo({
                                        object_type: 'aan_afvoergebied',
                                        object_id: node.data.id,
                                        object_name: node.data.text
                                    });
                                } else {
                                    node.expand();
                                }
                            }
                        }
                    },
                    store: 'Vss.store.CatchmentTree',
                    bbar: [{
                        text: 'Selecteer op kaart -->',
                        handler: function () {
                            Ext.getCmp('portalWindow').showNavigationPortalTemplate();
                        }
                    }]
                }
            }),
            Ext.create('Lizard.window.HeaderTab',{
                title: 'Analyse',
                name: 'analyse',
                object_types: ['aan_afvoergebied', 'krw_waterlichaam'],
                default_portal_template: 'analyse',
                navigation_portal_template: 'analyse'
            }),
            Ext.create('Lizard.window.HeaderTab',{
                title: 'Rapportage',
                name: 'rapportage',
                default_portal_template: 'rapportage',
                navigation_portal_template: 'rapportage'
            }),
            Ext.create('Lizard.window.HeaderTab',{
                title: 'Beheer',
                name: 'beheer',
                default_portal_template: 'beheer',
                navigation_portal_template: 'beheer'
            })
        ];

        var headerTab = 'watersysteem';
        var portalTemplate = null;
        var object_type = null;
        var object_id = null;

        if (window.location.hash) {
            var hash = window.location.hash;
            var parts = hash.replace('#', '').split('/');

            headerTab = parts[0];
            portalTemplate = parts[1];
            object_type = parts[2];
            object_id = parts[3];
        }


        var context_manager = Ext.create('Lizard.window.ContextManager', {
            user: {
                id: {{ user.id|default_if_none:"null" }},
                name: '{{ user.get_full_name }}',
                permission: [{% if perms.is_analyst %}'analyst',{% endif %}
{% if perms.is_veldmedewerker %}'veldmedewerker',{% endif %}{% if perms.is_beleidmaker %}'beleidmaker',{% endif %}'']
            },
            period: {
                selection: 6
            },
            base_url: '{% url portalpage %}',
            period_start: Ext.Date.add(new Date(), Ext.Date.YEAR, -5),
            period_end: new Date(),
            headertabs: headertabs,
            portalTemplate: portalTemplate,
            object_type: object_type,
            object_id: object_id,
            object_name: '-'
        });

        //todo: do this dynamic

        context_manager.setActiveHeadertab(headerTab);


        Ext.create('Lizard.window.Screen', {
            context_manager: context_manager,
            header: {
                headertabs: headertabs,
                src_logo: 'vss/stowa_logo.png',
                url_homepage: '/',
                close_on_logout: true
            }
        });
    }
});