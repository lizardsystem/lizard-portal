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
                            {name: 'handmatig', type: 'auto', defaultvalue: null},
                            {name: 'waarde', type: 'auto'},
                            {name: 'bron', type: 'string'},
                            {name: 'auto_waarde', type: 'auto'}
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
                    naam: 'Ecologische Sleutel factor 1',
                    waarde: 'goed',
                    auto_waarde: 'goed',
                    handmatig: false,
                    children: [
                        {naam: "Hoofd - Kritische belasting", waarde: 'goed', auto_waarde: 'goed',bron: '', expanded: false, children: [
                            {naam: "Algemeen", handmatig: false, waarde: '', bron: '', expanded: false, children: [
                                {leaf: true, naam: 'Metamodel', handmatig: true, waarde: 'PC lake', bron: 'Invoer'},
                                {leaf: true, naam: 'Gemiddelde toepassing', waarde: 'zomer', bron: 'Invoer'}
                             ]},
                            {naam: "P-Belasting kritisch", handmatig: false, waarde: 'goed', auto_waarde: 'goed', bron: '', expanded: false, children: [
                                {leaf: true, naam: 'Kritische grens P', handmatig: true, waarde: 3.5, bron: 'PC lake', auto_waarde: 3.5},
                                {leaf: true, naam: 'Belasting P', handmatig: false, waarde: 3, bron: 'Waterbalans', auto_waarde: 3.5}
                            ]},
                            {naam: "N-Belasting kritisch", handmatig: false, waarde: 'goed', auto_waarde: 'fout', bron: '', expanded: false, children: [
                                {leaf: true, naam: 'Kritische grens N', handmatig: true, waarde: 5.5, bron: 'PC lake', auto_waarde: 3.5},
                                {leaf: true, naam: 'Belasting N', handmatig: false, waarde: 2, bron: 'Waterbalans', auto_waarde: 3.5}
                            ]},
                            {leaf: true, naam: 'NP-ratio', handmatig: true, waarde: 5.5, bron: '', auto_waarde: 3.5},
                            {naam: "Verblijftijd", handmatig: false, waarde: 'goed', bron: '', expanded: false, children: [
                                 {leaf: true, naam: 'Hydraulische belasting', handmatig: false, waarde: 4000, bron: 'Waterbalans', auto_waarde: 4000},
                                 {leaf: true, naam: 'Diepte', handmatig: false, waarde: 10, bron: 'Invoer', auto_waarde: 10}
                             ]}
                        ]},
                        {naam: "Ondersteunend - P-concentratie versus norm", handmatig: true, waarde: 5.5, bron: '', auto_waarde: 3.5, expanded: false, children: [
                            {leaf: true, naam: 'Mediaan P-concentratie zomer', handmatig: false, waarde: 50, bron: 'Meting', auto_waarde: 50},
                            {leaf: true, naam: 'Norm P-concentratie', handmatig: false, waarde: 50, bron: '', auto_waarde: 50}
                        ]},
                        {naam: "Ondersteunend - P-Knelpunt AqMad", handmatig: true, waarde: 5.5, bron: '', auto_waarde: 3.5, expanded: false, children: [
                            {leaf: true, naam: 'Score P', handmatig: true, waarde: 1, bron: 'AqMad'},
                            {leaf: true, naam: 'Score PO4', handmatig: true, waarde: 22, bron: 'AqMad'}
                        ]}
                    ]}
                },
                multiSelect: true,
                //singleExpand: true,
                //the 'columns' property is now 'headers'
                columns: [{
                    xtype: 'treecolumn', //this is so we know which column will show the tree
                    text: 'Onderdeel',
                    width:250,
                    sortable: true,
                    dataIndex: 'naam'
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