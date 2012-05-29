{% load get_grid %}
{% load get_portal_template %}


{
    itemId: 'esf-overzicht-beheer',
    title: 'ESF overzicht',
	xtype: 'portalpanel',
    breadcrumbs: [
        {
            name: 'ESF overzicht'
        }
    ],
	items:[{
		flex:1,
		items: [{
            title: 'ESF',
            anchor:'100%',
            flex:1,
            xtype: 'leditgrid',
            columnLines: true,
            plugins: [
                'applycontext'
            ],
            applyParams: function(params) {
                var params = params|| {};
                console.log('apply params on store:');
                console.log(params);

                if (this.store) {
                    this.store.load();
                }
            },
            //proxyUrl: '/portal/wbstructures.json',
            proxyUrl: '/esf/api/esf_score_overview/',
            proxyParams: {
                flat: false,
                size: 'small',
                include_geom: false
            },
            addEditIcon: true,
            usePagination: true,
            //read_only_field: 'read_only',
            actionEditIcon:function(record) {
                var me = this
                console.log(this.store.getNewRecords())
                if (this.store.getNewRecords().length >0 ||
                    this.store.getUpdatedRecords().length >0 ||
                    this.store.getRemovedRecords().length >0) {

                    Ext.Msg.alert("Let op", 'Sla eerst de bewerking(en) in het grid op, voordat een enkel record kan worden bewerkt');
                    return
                }

                console.log('edit record:');
                console.log(record);

                if (record) {
                    params = {
                        object_id: record.get('ident')
                    }
                } else {
                    params = null
                }

                Ext.create('Ext.window.Window', {
                    title: 'ESF',
                    width: 600,
                    height: 600,
                    modal: true,
		            constrainHeader: true,
                    finish_edit_function: function (updated_record) {
                        me.store.load();
                    },
                    editpopup: true,
                    loader:{
                        loadMask: true,
                        autoLoad: true,
                        url: '/esf/main_esf_editor/',
                        ajaxOptions: {
                            method: 'GET'
                        },
                        params: params,
                        renderer: 'component'
                    }
                }).show();
            },
            addRecord: function() {
                this.actionEditIcon();
           },
            dataConfig:[
                {name: 'id', title: 'id', editable: false, visible: false, width: 30, type: 'number'},
                {name: 'ident', title: 'ident', editable: false, visible: true, width: 50, type: 'text'},
                {name: 'name', title: 'naam', editable: false, visible: true, width: 150, type: 'text'},
                {name: 'esf1', title: '1. belasting', editable: false, sortable: false, visible: true, width: 80, type: 'text'},
                {name: 'esf2', title: '2. licht', editable: false, sortable: false, visible: true, width: 80, type: 'text'},
                {name: 'esf3', title: '3. bodem', editable: false, sortable: false, visible: true, width: 80, type: 'text'},
                {name: 'esf4', title: '4. ', editable: false, sortable: false, visible: true, width: 80, type: 'text'},
                {name: 'esf5', title: '5. habitat', editable: false, sortable: false, visible: true, width: 80, type: 'text'},
                {name: 'esf6', title: '6. ', editable: false, sortable: false, visible: true, width: 80, type: 'text'},
                {name: 'esf7', title: '7. ', editable: false, sortable: false, visible: true, width: 80, type: 'text'},
                {name: 'esf8', title: '8. ', editable: false, sortable: false, visible: true, width: 80, type: 'text'},
                {name: 'esf9', title: '9. beleving', editable: false, sortable: false, visible: true, width: 80, type: 'text'}
           ]
        }]
	}]
}

