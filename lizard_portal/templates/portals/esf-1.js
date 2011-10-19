{
    xtype: 'portalpanel',
	items: [{
		width:500,
		items: [{
            flex:2,
            title: 'Opbouw ESF 1',
            items: {
                xtype: 'treepanel',
                frame: false,
                border:false,
                collapsible: false,
                useArrows: true,
                rootVisible: true,
                store: {
                    xtype: 'tree',
                    model: Ext.define('ESF', {
                        extend: 'Ext.data.Model',
                        fields: [
                            {name: 'naam', type: 'string'},
                            {name: 'handmatig', type: 'bool', defaultvalue: false},
                            {name: 'waarde', type: 'auto'},
                            {name: 'bron', type: 'string'},
                            {name: 'auto_waarde', type: 'float'}
                        ]
                    }),
                    proxy: {
                        type: 'ajax',
                        url: '/portal/example_treedata.json',
                        extraParams: {
                            isJSON: true
                        }
                    },
                    reader: {
                        type: 'json'
                    },
                    root: {
                    expanded: true,
                    naam: 'ESF 1',
                    waarde: 'goed',
                    children: [
                        {naam: "Belasting", handmatig: false, waarde: 'goed', bron: '', expanded: true, children: [
                            {leaf: true, naam: 'kritische grens P', handmatig: true, waarde: 3.5, bron: 'PC lake', auto_waarde: 3.5},
                            {leaf: true, naam: 'Belasting P', handmatig: false, waarde: 3, bron: 'Waterbalans', auto_waarde: 3.5},
                            {id:13, leaf: true, naam: 'kritische grens N', handmatig: true, waarde: 5.5, bron: 'PC lake', auto_waarde: 3.5},
                            {id:14, leaf: true, naam: 'Belasting N', handmatig: false, waarde: 2, bron: 'Waterbalans', auto_waarde: 3.5}
                        ]},
                        {id: 2, naam: "aqMad", expanded: false, children: [
                            {id: 3, naam: ".....", leaf: true},
                            {id: 4, naam: ".....", leaf: true},
                            {id: 5, naam: ".....", leaf: false}
                            ]}
                    ]}
                },
                multiSelect: true,
                singleExpand: true,
                //the 'columns' property is now 'headers'
                columns: [{
                    xtype: 'treecolumn', //this is so we know which column will show the tree
                    text: 'Onderdeel',
                    width:150,
                    sortable: true,
                    dataIndex: 'naam'
                },{
                    text: 'Handmatig',
                    flex: 1,
                    dataIndex: 'handmatig',
                    xtype: 'checkcolumn',
                    sortable: true
                },{
                    text: 'Waarde',
                    flex: 1,
                    dataIndex: 'waarde',
                    sortable: true
                },{
                    text: 'Bron',
                    flex: 1,
                    dataIndex: 'bron',
                    sortable: true
                },{
                    text: 'Auto. waarde',
                    flex: 1,
                    dataIndex: 'auto_waarde',
                    sortable: true
                }]
            }
        }]
	},{
        flex:1,
        items: {
            title: 'Grafieken',
            flex: 1,
            tbar: [{
                xtype: 'splitbutton',
                text: 'Fosfaat belasting',
                enableToggle: true,
                pressed: true,
                iconCls: 'chart',
                menu: {
                    defaults: {
                        //checked: true,
                        group: 'period',
                        handler: function(menuItem, checked) {
                            alert('Selected ' + menuItem.text + ' set to ' + checked);
                        }
                    },
                    items: [
                        { text: 'dag'},
                        { text: 'maand', checked: true},
                        { text: 'kwartaal'},
                        { text: 'jaar'}
                    ]
                }
            }]
        }
	}]
}