{
    itemId: 'esf-1',
    title: 'ESF details',
    xtype: 'portalpanel',
    breadcrumbs: [
        {
            name: 'watersysteemkaart',
            link: 'homepage'
        },
        {
            name: 'ESF overzicht',
            link: 'esf-overzicht'
        },
        {
            name: 'ESF 1: Belasting'
        }
    ],
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
            id: 'bbbb',
            flex: 1,
            xtype: 'multigraph'
         }
	}]
}