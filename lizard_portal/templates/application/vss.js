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

        {% get_portal_template watersysteem_layers %}


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
                                Ext.getCmp('portalWindow').linkTo({
                                    object_type: 'krw_waterlichaam',
                                    object_id: node.data.id,
                                    object_name: node.data.text});
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
                                Ext.getCmp('portalWindow').linkTo({
                                    object_type: 'aan_afvoergebied',
                                    object_id: node.data.id,
                                    object_name: node.data.text
                                });
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

        var context_manager = Ext.create('Lizard.window.ContextManager', {
            user: {
                id: {{ user.id|default_if_none:"null" }},
                name: '{{ user.get_full_name }}'
            },
            period_time: {
                period_start: '2000-01-01T00:00',
                period_end: '2002-01-01T00:00',
                moment: '2001-01-01T00:00'
            },
            base_url: '{% url site "vss" "watersysteem" %}',
            headertabs: headertabs
        });

        //todo: do this dynamic
        context_manager.setActiveHeadertab('watersysteem');


        Ext.create('Lizard.window.Screen', {
            context_manager: context_manager,
            header: {
                headertabs: headertabs,
                src_logo: 'vss/stowa_logo.png',
                url_homepage: '/'
            }
        });
    }

});