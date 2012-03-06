{% load get_grid %}
{% load get_portal_template %}

{
    itemId: "valideer_configuraties",
    title: "Valideer configuraties",
    xtype: "portalpanel",
    breadcrumbs: [{
                      name: "Beheer",
                      link: "beheer"
                  },
                  {
                      name: "Valideer configuraties"
                  }],
    items: [{
		flex: 1,
		items: [{
			    title: 'Configuraties',
			    xtype: 'leditgrid',
			    anchor: '100%',
			    flex:1,
			    columnLines: true,
			    dataConfig:[
				{name: 'polder', title: 'Polder', editable: false, visible: true, width: 150, type: 'text'},
				{name: 'type', title: 'Type', editable: false, visible: true, width: 150, type: 'text'},
				{name: 'gebruiker', title: 'Gebruiker', editable: false, visible: true, width: 150, type: 'text'},
				{name: 'datum', title: 'Datum', editable: false, visible: true, width: 150, type: 'text'}
			    ]
			}]
	    }]
}
