{
    itemId: 'maatregelen',
    title: 'Maatregelen',
	xtype: 'portalpanel',
    breadcrumbs: [
    {
        name: 'KRW-overzicht',
        link: 'krw-overzicht'
    },{
        name: 'Maatregelen'
    }],
	items:[{
		flex: 1,
		items: [{
			title: 'Maatregelen',
            flex:1,
            html: 'Grafiek<br><br>Per maatregel:<br>- Naam<br>- Type<br>- Maatregel/ deelmaatregel<br>- KRW maatregel<br>- Initiatiefnemmer<br>- Bron<br><a href="">details</a>',
            tbar: ['Maatregel toevoegen','Bepaal focus maatregel']
		}]
	}]
}
