/**
 * Created by PyCharm.
 * User: bastiaanroos
 * Date: 19-10-11
 * Time: 10:36
 * To change this template use File | Settings | File Templates.
 */
{
	itemId: 'analyse-interpretatie',
    title: 'Overzicht analyse interpretaties',
    xtype: 'portalpanel',
	items: [{
		flex:1,
		items: [{
			title: 'Analyse interpretatie',
            flex:1,
            items: {
                xtype: 'grid',
                listeners: {
                    itemclick: {
                        fn: function(grid, record) {
                            console.log(record);
                            Ext.getCmp('portalWindow').linkTo({
                                area:record.data.id,
                                portalTemplate:'analyse-interpretatie-details'
                              }) ;
                        }
                    }      
                },
                plugins: [
                    Ext.create('Ext.grid.plugin.CellEditing', {
                            clicksToEdit: 1
                 })],
                columns: [
                {   
                    text: 'Titel',
                    width:150,
                    sortable: true,
                    dataIndex: 'title',
                    field: {
                        allowBlank: false
                    }
                },{
                    text: 'Categorie',
                    flex: 1,
                    dataIndex: 'category',
                    sortable: true
                },{
                    text: 'Datum',
                    flex: 1,
                    dataIndex: 'datetime_period_start',
                    sortable: true,
                    //renderer: formatDate,
                    field: {
                        xtype: 'datefield',
                        format: 'm/d/y',
                        minValue: '01/01/06',
                        disabledDays: [0, 6],
                        disabledDaysText: 'Plants are not available on the weekends'
                    }
                },{
                    text: 'Status',
                    flex: 1,
                    dataIndex: 'status',
                    sortable: true
                },{
                    text: 'Auteur',
                    flex: 1,
                    dataIndex: 'created_by',
                    sortable: true
                }],
                store: {
                    xtype: 'store',
                    storeId: 'analyse_store',
                    autoLoad: true,
                    model: Ext.define('Analyse_interpretatie', {
                        extend: 'Ext.data.Model',
                        fields: [
                            {name: 'title', type: 'string'},
                            {name: 'category', type: 'string'},
                            {name: 'datetime_period_start', type: 'auto'},
                            {name: 'created_by', type: 'string'},
                            {name: 'status', type: 'string'},
                            {name: 'id', type: 'string'}
                        ]
                    }),
                    proxy: {
                        type: 'ajax',
                        url: '/annotation/api/grid/',
                        extraParams: {
                            _accept: 'application/json',
                            type: 'interpretatie'
                        },
                        reader: {
                            root: 'annotations',
                            type: 'json'
                        }
                    }
                },
                bbar: [{
                    xtype: 'button',
                    text: 'cancel',
                    iconCls: 'cancel',
                    handler: function(menuItem, checked) {
                        Ext.data.StoreManager.lookup('analyse_store').rejectChanges();
                    }
                },{
                    xtype: 'button',
                    text: 'Save',
                    iconCls: 'save',
                    handler: function(menuItem, checked) {
                        Ext.data.StoreManager.lookup('analyse_store').sync();
                    }
                }]

            }
        }]
	}]
}
