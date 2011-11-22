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
        'Lizard.window.ContextManager',
        'Lizard.grid.EditablePropertyGrid',
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


        var tabs = [{
                title: 'Beleid',
                name: 'beleid',
                navigation: {
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
                                Ext.getCmp('portalWindow').linkTo({object_id: node.data.id});
                            }
                        }
                    },
                    store: 'Vss.store.KrwGebiedenTree',
                    bbar: [{
                        text: 'Selecteer op kaart -->',
                        handler: function () {
                            Ext.getCmp('portalWindow').showAreaSelection();
                        }
                    }]
                }
            }, {
                title: 'Watersysteem',
                name: 'watersysteem',
                navigation: {
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
                                Ext.getCmp('portalWindow').linkTo({object_id: node.data.id});
                            }
                        }
                    },
                    store: 'Vss.store.CatchmentTree',
                    bbar: [{
                        text: 'Selecteer op kaart -->',
                        handler: function () {
                            Ext.getCmp('portalWindow').showAreaSelection();
                        }
                    }]
                }
            }, {
                title: 'Analyse',
                name: 'analyse'
            }, {
                title: 'Rapportage',
                name: 'rapportage'
            }, {
                title: 'Beheer',
                name: 'beheer'
        }];

        var settings = {
            area_selection_template: 'aan_afvoergebied_selectie',
            area_store: 'Vss.store.CatchmentTree',
            header: {
                tabs: tabs,
                active_tab: 'watersysteem',
                src_logo: 'vss/stowa_logo.png',
                url_homepage: '/'
            },
            user: {
                id: {{ user.id|default_if_none:"null" }},
                name: '{{ user.get_full_name }}'
            },

            permission_description: 'viewer',//TODO
            lizard_context: {
                period_start: '2000-01-01T00:00',
                period_end: '2002-01-01T00:00',
                object: 'aan_afvoergebied',
                object_id: null,
                portalTemplate:'homepage',
                base_url: '{% url site "vss" "watersysteem" %}'
            }
        }

        Ext.create('Lizard.window.Screen', settings);
    }

});