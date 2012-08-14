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
                      name: "Valideren waterbalans/ESF configuraties"
                  }],
    items: [{
		flex: 1,
		items: [{
			    title: 'Configuraties',
			    xtype: 'leditgrid',
			    storeAutoLoad: true,
			    anchor: '100%',
			    flex:1,
			    columnLines: true,
			    dataConfig:[
				{name: 'id', title: 'id', editable: false, 
				 visible: false, width: 30, type: 'number'},
				{name: 'polder', title: 'Polder',
				 editable: false, visible: true, width: 300,
				 type: 'text'},
				{name: 'type', title: 'Type', editable: false,
				 visible: true, width: 100, type: 'text'},
				{name: 'name', title: 'Naam',
				 editable: false, visible: true, width: 200,
				 type: 'text'},
				{name: 'user', title: 'Gebruiker',
				 editable: false, visible: true, width: 150,
				 type: 'text'},
				{name: 'date', title: 'Datum', editable: false,
				 visible: true, width: 175, type: 'text'},
				{name: 'action', title: 'Actie',
				 editable: true, visible: true,
				 width: 100, type: 'combo',
				 choices: [{id:0, name:'Bewaren'}, {id:1, name: 'Valideren'}, {id:2, name: 'Afkeuren'}]},
				{name: 'action_log', title: 'Log van validatie',
				 editable: false, visible: true, width: 400, type: 'text'}
			    ],


			    useAddDeleteButtons: false,

			    proxyUrl: '/portal/api/configuration/',
			    proxyParams: {
				flat: false,
				size: 'small',
				include_geom: false
			    },
                addEditIcon: true,
			    actionEditIcon: function(record) {
				var me = this;
				console.log(this.store.getNewRecords());
				if (this.store.getNewRecords().length >0 ||
				    this.store.getUpdatedRecords().length >0 ||
				    this.store.getRemovedRecords().length >0) {

				    Ext.Msg.alert("Let op", 'Sla eerst de bewerking(en) in het grid op, voordat een enkel record kan worden bewerkt');
				    return;
				}

				console.log('edit record:');
				console.log(record);

				if (record) {
				    params = {
					measure_id: record.data.id
				    };

				} else {
				    params = null;
				}

				Ext.create('Ext.window.Window', {
					       title: 'Verschillen tussen configuraties',
					       autoHeight: false,
					       height: Ext.getBody().getViewSize().height * .50,
					       autoScroll: true,
					       width: 800,
					       modal: true,
					       editpopup: false,
				               constrainHeader: true,
					       loader:{
						   loadMask: true,
						   autoLoad: true,
						   url: '/validation/diff/' + record.data.polder + '/' + record.data.type,
						   ajaxOptions: {
						       method: 'GET'
						   },
						   params: params,
						   renderer: 'html'
					       }
					   }).show();
			    }
            {% if perm.is_funct_beheerder %}
            {% else %}
                ,editable: false
            {% endif %}
			}]

	    }]
}
