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
				{name: 'user', title: 'Gebruiker',
				 editable: false, visible: true, width: 150,
				 type: 'text'},
				{name: 'date', title: 'Datum', editable: false,
				 visible: true, width: 175, type: 'text'},
				{name: 'action', title: 'Actie',
				 editable: true, visible: true,
				 width: 100, type: 'combo',
				 choices: [{id:0, name:'Bewaren'}, {id:1, name: 'Valideren'}]},
				{name: 'action_log', title: 'Log van validatie',
				 editable: false, visible: true, width: 400, type: 'text'}
			    ],
			    useAddDeleteButtons: false,
			    addDeleteIcon: true,
			    addEditIcon: true,
			    proxyUrl: '/portal/api/configuration/',
			    proxyParams: {
				flat: false,
				size: 'small',
				include_geom: false
			    },
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
					       width: 800,
					       height: 600,
					       modal: true,
					       editpopup: false,
					       loader:{
						   loadMask: true,
						   autoLoad: true,
						   url: '/portal/diff/' + record.data.polder,
						   ajaxOptions: {
						       method: 'GET'
						   },
						   params: params,
						   renderer: 'html'
					       }
					   }).show();
			    }
			}]
	    }]
}
