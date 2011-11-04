/**
 * Created by PyCharm.
 * User: bastiaanroos
 * Date: 19-10-11
 * Time: 17:52
 * To change this template use File | Settings | File Templates.
 */
{
    itemId: 'waterbalans-configuratie',
    title: 'Waterbalans-configuratie',
	xtype: 'portalpanel',
	items:[{
		flex:1,
		items: [{
			title: 'Instellingen',
            flex:1,
            layout:{
                type: 'table',
                columns:1
            },
            autoScroll:true,
            bbar: [{
                xtype: 'button',
                text: 'Cancel',
                iconCls: 'cancel',
                handler: function(menuItem, checked) {
                    Ext.data.StoreManager.lookup('analyse_store').rejectChanges();
                }
            },{
                xtype: 'button',
                text: 'Save',
                iconCls: 'save',
                handler: function(menuItem, checked) {
                    //Ext.data.StoreManager.lookup('analyse_store').sync();
                    Ext.MessageBox.prompt('save', 'Commentaar bij veranderingen', function (btn, text){ Ext.MessageBox.alert('Opgeslagen')})
                }
            }],
            items:[{
                title: 'Gebied eigenschappen',
                //height:400,
                width:500,
                xtype: 'propertygrid',
                sortableColumns: false,
                source: {
                    "1 Code": "SAP",
                    "2 Naam": "Stichtsch Ankerveensche Polder",
                    "3 Tijdserie Neerslag": "SAP-Neerslag",
                    "4 Tijdserie Verdamping": "Schiphol- Verdamping",
                    "5 Tijdserie Chloride meting 1": "Gemaal x - chloride",
                    "6 Tijdserie Chloride meting 2": "-",
                    "7 Tijdserie Gemeten waterpeil": "Gemaal x - waterpeil",
                    "8 Maximale inlaat capaciteit peilhandhaving ": "-",
                    "9 Maximale uitlaat capaciteit peilhandhaving ": "4000"
                }
            },{
                title: 'Openwater',
                //height:400,
                width:500,
                xtype: 'propertygrid',
                sortableColumns: false,
                source: {
                    "0 Oppervlak Openwater": "245600",
                    "1 Volg Streefpeil": "Ja",
                    "2 Streefpeil is tijdserie": "nee",
                    "3 Tijdserie streefpeil": "-",
                    "4 Winterpeil": -1.63,
                    "5 Lentepeil": -1.63,
                    "6 Zomerpeil": -1.63,
                    "7 Herfstpeil": -1.63,
                    "8 Marge boven": 0.01,
                    "9 Marge onder": 0.01
                }
            },{
                title: 'Bakjes',
                height:400,
                //xtype: 'grid',
                sortableColumns: false
            },{
                title: 'Kunstwerken',
                height:400,
                xtype: 'grid',
                plugins: [
                    Ext.create('Ext.grid.plugin.CellEditing', {
                            clicksToEdit: 1
                 })],
                columns: [
                    {
                        text: 'Code',
                        width:150,
                        sortable: true,
                        dataIndex: 'code',
                        field: {
                            allowBlank: false
                        }
                    },{
                        text: 'Naam',
                        flex: 1,
                        dataIndex: 'naam',
                        sortable: true
                    },{
                        text: 'Opgedrukt',
                        flex: 1,
                        dataIndex: 'opgedrukt',
                        sortable: true
                    },{
                        text: 'Van gebied',
                        flex: 1,
                        dataIndex: 'van',
                        sortable: true
                    },{
                        text: 'Naar gebied',
                        flex: 1,
                        dataIndex: 'naar',
                        sortable: true
                    },{
                        text: 'Is tijdserie',
                        flex: 1,
                        dataIndex: 'naar',
                        sortable: true
                    },{
                        text: 'Tijdserie debiet',
                        flex: 1,
                        dataIndex: 'ts_deb',
                        sortable: true
                    },{
                        text: 'Zomer debiet',
                        flex: 1,
                        dataIndex: 'naar',
                        sortable: true
                    },{
                        text: 'Winter debiet',
                        flex: 1,
                        dataIndex: 'naar',
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
                            {name: 'period_start', type: 'auto'},
                            {name: 'user_creator', type: 'string'},
                            {name: 'status', type: 'string'},
                            {name: 'id', type: 'string'}
                        ]
                    }),
                    proxy: {
                        type: 'ajax',
                        url: '/annotation/api/annotation/',
                        extraParams: {
                            _accept: 'application/json',
                            type: 'interpretatie'
                        },
                        reader: {
                            root: 'annotations',
                            type: 'json'
                        }
                    }
                }
            }]
		}]
	},{
		width:250,
		items: [{
			title: 'Geschiedenis',
            flex:1,
 			html: '<div class="portlet-content">Hier komt de edit geschiedenis</div>',
            extent: 2
		}]
	}]
}