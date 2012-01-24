{% load get_grid %}
{% load get_portal_template %}

{% if perms.auth.is_analyst %}

{
    itemId: 'doelen-beheer',
    title: 'doelen-beheer',
	xtype: 'portalpanel',
    breadcrumbs: [
        {
            name: 'doelen-beheer'
        }
    ],
	items:[{
		flex:1,
		items: [{
            title: 'Maatregelen',
            anchor:'100%',
            autoHeight: true,
            xtype: 'leditgrid',
            plugins: [
                'applycontext'
            ],

            applyParams: function(params) {
                var params = params|| {};
                console.log('apply params');
                console.log(params);

                if (this.store) {
                    //this.store.applyParams({object_id: params.object_id,
                    //                        area_object_type: 'Structure'});
                    //this.store.load();
                }
            },
            //proxyUrl: '/portal/wbstructures.json',
            proxyUrl: '/wbconfiguration/api/area_object_configuration/',
            proxyParams: {},
            dataConfig:[
                //is_computed altijd 1 in en 1 uit en verder niet
                {name: 'id', title: 'id', editable: false, visible: false, width: 100, type: 'text'},
                {name: 'area_code', title: 'Gebiedscode', editable: false, visible: true, width: 100, type: 'text'},
                {name: 'area_name', title: 'Gebied', editable: false, visible: true, width: 200, type: 'text'},
                {title: 'Fytoplankton', columns: [
                        {name: 'current_value', title: 'waarde', editable: false, visible: true, width: 45, type: 'number'},
                        {name: 'doel2015', title: '2015', editable: true, visible: true, width: 45, type: 'number'},
                        {name: 'doel2027', title: '2027', editable: true, visible: true, width: 45, type: 'number'}
                     ]
                },
                {title: 'Macrofauna', columns: [
                        {name: 'current_value', title: 'waarde', editable: false, visible: true, width: 45, type: 'number'},
                        {name: 'doel2015', title: '2015', editable: true, visible: true, width: 45, type: 'number'},
                        {name: 'doel2027', title: '2027', editable: true, visible: true, width: 45, type: 'number'}
                     ]
                },
                {title: 'Macrofyten', columns: [
                        {name: 'current_value', title: 'waarde', editable: false, visible: true, width: 45, type: 'number'},
                        {name: 'doel2015', title: '2015', editable: true, visible: true, width: 45, type: 'number'},
                        {name: 'doel2027', title: '2027', editable: true, visible: true, width: 45, type: 'number'}
                     ]
                },
                {title: 'Vis', columns: [
                        {name: 'current_value', title: 'waarde', editable: false, visible: true, width: 45, type: 'number'},
                        {name: 'doel2015', title: '2015', editable: true, visible: true, width: 45, type: 'number'},
                        {name: 'doel2027', title: '2027', editable: true, visible: true, width: 45, type: 'number'}
                     ]
                }//toevoegen grenswaarden: 5
           ]
        }]
	}]
}
{% else %}
    {% get_portal_template geen_toegang %}
{% endif %}
