{
    itemId: 'esf-1',
    title: 'ESF details',
    xtype: 'portalpanel',
	items: [{
		width:500,
		items: [{
            flex:2,
            title: 'Opbouw ESF 1',
            closable: false,
            items: {
                flex: 1,
                xtype: 'esf_grid'
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