{% load get_portal_template %}

Ext.Loader.setPath('Lizard', '{{ STATIC_URL }}lizard_portal/lizard');
Ext.Loader.setPath('Vss', '{{ STATIC_URL }}lizard_portal/vss');
Ext.Loader.setPath('GeoExt', '{{ STATIC_URL }}geoext4/src');


Ext.application({
    name: 'KRW_vss',
    models: [
        'Vss.model.App',
        'Vss.model.AppScreen',
        'Vss.model.Communique',
        'Vss.model.Esf',
        'Vss.model.ObjectTree',
        'Vss.model.PropertyGrid',
        'Vss.model.WaterbalanceBucket',
        'Vss.model.WaterbalanceStructure',
        'Vss.model.AnnotationDetail',
        'Vss.model.AnnotationDescription',
        'Vss.model.TimeserieObject',
        'Lizard.model.Graph'
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
        'Vss.store.KrwToestandGraph',
        'Lizard.store.AppScreen',
        'Lizard.store.Graph'
    ],
    requires: [
        'Lizard.plugin.ApplyContext',
        'Ext.Img',
        'Ext.grid.*',
        'Ext.grid.plugin.*',
        'Ext.data.Model',
        'Ext.data.StoreManager',
        'Ext.data.*',
        'Ext.tree.*',
        'Ext.form.*',
        'Ext.button.*',
        'Ext.toolbar.*',
        'Lizard.ux.CheckColumn',
        'Lizard.ux.CheckColumnTree',
        'Lizard.ux.VBoxScroll',
        'Lizard.ux.ImageResize',
        'GeoExt.panel.Map',
        'GeoExt.data.LayerStore',
        'GeoExt.data.LayerModel',
        'GeoExt.data.reader.Layer',
        'Ext.MessageBox',
        'Lizard.window.Screen',
        'Lizard.window.HeaderTab',
        'Lizard.window.ContextManager',
        'Lizard.grid.EditablePropertyGrid',
        'Lizard.form.ComboMultiSelect',
        'Lizard.grid.EditableGrid',
        'Lizard.store.EditGridStore',
        'Lizard.portlet.AppScreenPortlet',
        'Lizard.portlet.Portlet',
        'Lizard.portlet.PortalPanel',
        'Lizard.portlet.PortalColumn',
        'Lizard.portlet.GridPortlet',
        'Lizard.portlet.MultiGraph',
        'Lizard.portlet.MultiGraphStore',
        'Lizard.window.Header',
        'Vss.grid.Esf',
        'Lizard.form.FormAutoload',
        'Lizard.grid.GridComboBox',
        'Lizard.grid.ComboDict',
        'Lizard.grid.CellEditing',
        'Lizard.form.TableField'
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

        var aan_afvoergebied_selection =
        {
            id: 'select_aan_afvoergebied',
            title: 'aan_afvoer',
            xtype: 'treepanel',
            selection_portal_template: 'aan_afvoergebied_selectie',
            listeners: {
                itemclick: {
                    fn: function (tree, node) {
                        //if not root
                        if (node.raw) {
                            Ext.getCmp('portalWindow').linkTo({
                                object_type: 'aan_afvoergebied',
                                object_id: node.data.ident,
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


        var KRW_selection =
        {
            id: 'select_krw_waterlichaam',
            title: 'krw',
            xtype: 'treepanel',
            selection_portal_template: 'krw_selectie',
            listeners: {
                itemclick: {
                    fn: function (tree, node) {
                        //if not root
                        if (node.raw) {
                            Ext.getCmp('portalWindow').linkTo({
                                object_type: 'krw_waterlichaam',
                                object_id: node.data.ident,
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


        var headertabs = [
            Ext.create('Lizard.window.HeaderTab', {
                title: 'Beleid',
                name: 'beleid',
                popup_navigation: true,
                popup_navigation_portal: true,
                default_portal_template: 'krw-overzicht',
                object_types: ['krw_waterlichaam'],
                navigation: KRW_selection.id
            }),
            Ext.create('Lizard.window.HeaderTab', {
                title: 'Watersysteem',
                name: 'watersysteem',
                popup_navigation: true,
                popup_navigation_portal: true,
                default_portal_template: 'homepage',
                object_types: ['aan_afvoergebied'],
                navigation: aan_afvoergebied_selection.id
            }),
            Ext.create('Lizard.window.HeaderTab',{
                title: 'Analyse',
                name: 'analyse',
                popup_navigation: true,
                popup_navigation_portal: true,
                default_portal_template: 'analyse',
                object_types: ['aan_afvoergebied'],
                navigation: aan_afvoergebied_selection.id
            }),
            Ext.create('Lizard.window.HeaderTab',{
                title: 'Rapportage',
                name: 'rapportage',
                popup_navigation: false,
                popup_navigation_portal: false,
                default_portal_template: 'rapportage',
                object_types: ['aan_afvoergebied', 'krw_waterlichaam']
                //heeft beide navigatie mogelijkheden optioneel
            }),
            Ext.create('Lizard.window.HeaderTab',{
                title: 'Beheer',
                name: 'beheer',
                popup_navigation: false,
                popup_navigation_portal: false,
                default_portal_template: 'beheer'

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
                permission: [
                    {% if perms.auth.is_analyst %}'analyst',{% endif %}
                    {% if perms.auth.is_veldmedewerker %}'veldmedewerker',{% endif %}
                    {% if perms.auth.is_beleidmaker %}'beleidmaker',{% endif %}'']
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

        context_manager.setActiveHeadertab(headerTab)

        Ext.create('Lizard.window.Screen', {
            context_manager: context_manager,
            showOnlyPortal: only_portal || false,
            header: {
                headertabs: headertabs,
                src_logo: 'vss/stowa_logo.png',
                url_homepage: '/'
            },
            navigation_tabs: [
                KRW_selection,
                aan_afvoergebied_selection
            ]
        });
    }
});
