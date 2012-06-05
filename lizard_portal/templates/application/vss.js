{% load get_portal_template %}

Ext.Loader.setPath('Lizard', '{{ STATIC_URL }}lizard_portal/lizard');
Ext.Loader.setPath('Vss', '{{ STATIC_URL }}lizard_portal/vss');
Ext.Loader.setPath('GeoExt', '{{ STATIC_URL }}geoext4/src');

if (typeof(console)=='undefined') {
    console = {
        log: function() {}
    }
}

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
        'Lizard.model.Graph',
        'Lizard.model.CollageModel',
        'Lizard.model.WorkspaceModel',
        'Lizard.model.AvailableLayersModel'
    ],
    stores: [
        'Vss.store.Communique',
        'Vss.store.Esf',
        'Vss.store.EsfHistory',
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
        'Lizard.store.Graph',
        'Vss.store.TimeserieObject'
    ],
    requires: [
        'Lizard.plugin.ApplyContext',
        'Lizard.ux.CheckColumn',
        'Lizard.ux.LoadingBalk',
        'Lizard.ux.CheckColumnTree',
        'Lizard.ux.VBoxScroll',
        'Lizard.ux.ImageResize',
        'GeoExt.panel.Map',
        'GeoExt.data.LayerStore',
        'GeoExt.data.LayerModel',
        'GeoExt.data.reader.Layer',
        // 'GeoExt.tree.LayerContainer',
        'Ext.MessageBox',
        'Lizard.ContextManager',
        'Lizard.window.Screen',
        'Lizard.window.HeaderTab',
        'Lizard.grid.EditablePropertyGrid',
        'Lizard.form.ComboMultiSelect',
        'Lizard.form.WorkspaceSaveForm',
        'Lizard.form.CollageSaveForm',
        'Lizard.form.BackgroundLayerSelector',
        'Lizard.grid.EditableGrid',
        'Lizard.store.EditGridStore',
        'Lizard.store.AvailableLayersStore',
        'Lizard.store.CollageItemStore',
        'Lizard.store.CollageStore',  // Not yet used
        'Lizard.store.WorkspaceItemStore',
        'Lizard.store.WorkspaceStore',  // Not yet used
        'Lizard.portlet.AppScreenPortlet',
        'Lizard.portlet.AppsPortlet',
        'Lizard.portlet.AvailableLayersPortlet',
        'Lizard.portlet.Portlet',
        'Lizard.portlet.PortalPanel',
        'Lizard.portlet.PortalColumn',
        'Lizard.portlet.MapPortlet',
        'Lizard.portlet.GridPortlet',
        'Lizard.portlet.MultiGraph',
        'Lizard.portlet.MultiGraphStore',
        'Lizard.portlet.MultiImagePortlet',
        'Lizard.portlet.MultiLegendPortlet',
        'Lizard.portlet.CollagePortlet',
        'Lizard.portlet.WorkspacePortlet',
        'Lizard.popup.FeatureInfo',
        'Lizard.popup.TimeSeriesGraph',
        'Lizard.popup.AnnotationPopup',
        'Lizard.popup.MeasurePopup',
        'Lizard.window.MapWindow',
        'Lizard.window.Header',
        'Vss.grid.Esf',
        'Vss.grid.EsfHistory',
        'Vss.grid.WbHistory',
        'Vss.grid.EsfMainEditor',
        'Lizard.window.EditSummaryBox',
        'Lizard.form.FormAutoload',
        'Lizard.grid.GridComboBox',
        'Lizard.grid.ComboDict',
        'Lizard.grid.CellEditing',
        'Lizard.form.TableField'
    ],
    launch: function() {
        //TODO: for the time being on this location, a better location??

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

        // Globally create workspace layers

        // !Try! to initialize WorkspaceStore, does not work yet.
        // Ext.create(Lizard.store.WorkspaceStore, );
        Ext.create(Lizard.store.WorkspaceItemStore, {storeId: 'WorkspaceItems'} );
        Ext.create(Lizard.store.CollageItemStore, {storeId: 'CollageItems'} );

        Lizard.store.WorkspaceStore.get_or_create('analyse')
        Lizard.store.CollageStore.get_or_create('analyse')

        var aan_afvoergebied_selection =
        {
            id: 'select_aan_afvoergebied',
            object_type: 'aan_afvoergebied',
            title: 'aan_afvoer',
            xtype: 'treepanel',
            selection_portal_template: 'aan_afvoergebied_selectie',
            listeners: {
                itemclick: {
                    fn: function (tree, node) {
                        //if not root
                        if (node.raw) {
                            Ext.getCmp('portalWindow').linkTo({
                                object:{
                                    type: 'aan_afvoergebied',
                                    id: node.data.ident,
                                    name: node.data.text
                                }
                            });
                        } else {
                            node.expand();
                        }
                    }
                }
            },
            store: 'Vss.store.CatchmentTree',
            bbar: [{
                text: 'Selecteer op overzichtskaart -->',
                handler: function () {
                    Ext.getCmp('portalWindow').showNavigation('select_aan_afvoergebied');
                }
            }]
        }


        var KRW_selection =
        {
            id: 'select_krw_waterlichaam',
            title: 'krw',
            object_type: 'krw_waterlichaam',
            xtype: 'treepanel',
            selection_portal_template: 'krw_selectie',
            listeners: {
                itemclick: {
                    fn: function (tree, node) {
                        //if not root
                        if (node.raw) {
                            Ext.getCmp('portalWindow').linkTo({
                                object:{
                                    type: 'krw_waterlichaam',
                                    id: node.data.ident,
                                    name: node.data.text
                                }
                            });
                        } else {
                            node.expand();
                        }
                    }
                }
            },
            store: 'Vss.store.KrwGebiedenTree',
            bbar: [{
                text: 'Selecteer op overzichtskaart -->',
                handler: function () {
                    Ext.getCmp('portalWindow').showNavigation('select_krw_waterlichaam');
                }
            }]
        }

        var headertabs = [
            Ext.create('Lizard.window.HeaderTab', {
                title: 'Overzicht',
                name: 'overzicht',
                popup_navigation: false,
                popup_navigation_portal: false,
                default_portal_template: 'themakaart-ekr',
                menu: [{
                    text: 'Themakaart KRW',
                    handler: function() { Lizard.CM.setContext({headertab: 'overzicht', portal_template:'themakaart-ekr'}); }
                },{
                    text: 'Themakaart ESF',
                    handler: function() { Lizard.CM.setContext({headertab: 'overzicht', portal_template:'themakaart-esf'}); }
                },{
                    text: 'Themakaart maatregelen',
                    handler: function() { Lizard.CM.setContext({headertab: 'overzicht', portal_template:'themakaart-maatregelen'}); }
                }]
            }),
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
                default_portal_template: 'beheer',
                menu: [
		// keep these objects in sync with those in ../portals/vss.js
                {
                     text: 'ESF overzicht',
                     {% if user.is_authenticated %}
                     disabled: false,
                     {% endif %}
                     handler: function() { Lizard.CM.setContext({headertab: 'beheer',portal_template:'esf-overzicht-tabel'}); }
                },
                {
                     text: 'Stuurparameters',
                     {% if user.is_authenticated %}
                     disabled: false,
                     {% endif %}
                     handler: function() { Lizard.CM.setContext({headertab: 'beheer',portal_template:'stuurparameter-overzicht'}); }
                },
                {
                     text: 'EKR overzicht',
                     {% if user.is_authenticated %}
                     disabled: false,
                     {% endif %}
                     handler: function() { Lizard.CM.setContext({headertab: 'beheer',portal_template:'doelen-beheer'}); }
                },
                {
                     text: 'Maatregelen',
                     {% if user.is_authenticated %}
                     disabled: false,
                     {% endif %}
                     handler: function() { Lizard.CM.setContext({headertab: 'beheer',portal_template:'maatregelen-beheer'}); }
                },
                {
                   text: 'Geschikte maatregelen',
                     {% if user.is_authenticated %}
                     disabled: false,
                     {% endif %}
                     handler: function() { Lizard.CM.setContext({headertab: 'beheer',portal_template:'esfpattern-beheer'}); }
                },
                {
                     text: 'Organisaties',
                     {% if user.is_authenticated %}
                     disabled: false,
                     {% endif %}
                     handler: function() { Lizard.CM.setContext({headertab: 'beheer',portal_template:'organisatie-beheer'}); }
                },
		        {
                   text: 'Koppeling KRW en aan/afvoergebieden',
                     {% if user.is_authenticated %}
                     disabled: false,
                     {% endif %}
                     handler: function() { Lizard.CM.setContext({headertab: 'beheer',portal_template:'area_link'}); }
                },{
                    text: 'Upload FEWS import bestanden',
                    {% if user.is_authenticated %}
                    disabled: false,
                    {% endif %}
                    handler: function() { window.open('/portal/uploadfile/') }
                },
                {
                    text: 'Upload configuratie file',
                    {% if user.is_authenticated %}
                    disabled: false,
                    {% endif %}
                    handler: function() { window.open('/portal/uploadfile/') }
                },
                {
                   text: 'Valideren waterbalans/ESF configuraties',
                     {% if user.is_authenticated %}
                     disabled: false,
                     {% endif %}
                     handler: function() { Lizard.CM.setContext({headertab: 'beheer',portal_template:'valideer_configuraties'}); }
                },
                {
                     text: 'Gebruikers',
                     {% if user.is_authenticated %}
                     disabled: false,
                     {% endif %}
                     handler: function() { window.open('/manager/') }
                },
                {
                     text: 'Serverprocessen',
                     {% if user.is_authenticated %}
                     disabled: false,
                     {% endif %}
                     handler: function() { window.open('/task/') }
                }
		]
            })
        ];

        //(1) initialise Context Manager with default settings
        Lizard.ContextManager.setConfiguration({
            headertabs: headertabs,
            context: {
                base_url: '{% url portalpage %}',
                period_start: Ext.Date.add(new Date(), Ext.Date.YEAR, -5),
                period_end: new Date(),
                init_zoom: [{{ extent }}],
                background_layer: {
                    layers:"",
                    is_clickable:false,
                    request_params: {},
                    title:"openstreetmap",
                    single_tile:false,
                    ollayer_class: "OpenLayers.Layer.OSM",
                    js_popup_class:"",
                    plid:164,//todo: link hierna dynamisch maken?
                    id:164,
                    is_local_server:false,
                    options:{},
                    is_base_layer:true,
                    url:""
                },
                period: {
                    start: Ext.Date.add(new Date(), Ext.Date.YEAR, -5),
                    end: new Date(),
                    type: 6
                },
                user: {
                    id: {{ user.id|default_if_none:"null" }},
                    name: '{{ user.get_full_name }}',
		    groups: [
			{% for group in user.user_group_memberships.all %}
			'{{ group.name }}',
			{% endfor %}
		    ],
                    organization: '{% for profile in  user.userprofile_set.all %}{{profile.organisation.name}} {% endfor %}',
                    permissions: [
{% for perm in permission_list %}
'{{perm.name}}',
{% endfor %}
''
                    ]
                }
            }
        })
        Lizard.ContextManager.setContext({
                headertab: 'watersysteem'
        }, false)

        //(2) overwrite defaults with stored context
        stored_context = Ext.JSON.decode({% autoescape off %}'{{ context|addslashes }}'{% endautoescape %})

        if (stored_context.objects) {
            Lizard.ContextManager.setConfiguration({objects: stored_context.objects});
        }
        if (stored_context.context) {
            Lizard.ContextManager.setContext(stored_context.context, false);
        }

        //(3) overwrite defaults and context
        if (window.location.hash) {
            var hash = window.location.hash;
            var parts = hash.replace('#', '').split('/');

            hash_context = {}
            hash_context.headertab = parts[0];
            hash_context.portal_template = parts[1];
            if (parts.length > 3) {
                hash_context.object = {
                    type:  parts[2],
                    id: parts[3],
                    name: ''
                }
            }
            Lizard.ContextManager.setContext(hash_context, false)
        }

        Ext.create('Lizard.window.Screen', {
            context_manager: Lizard.ContextManager,
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
