/**
 * Created by PyCharm.
 * User: bastiaanroos
 * Date: 18-10-11
 * Time: 11:27
 * To change this template use File | Settings | File Templates.
 */

{
	xtype: 'portalpanel',
	items: [{
		id: 'col-a1',
		width: 600,
		items: [{
			id: 'portlet-1',
			title: 'Gebied eigenschappen',
            height:400,
            items: {
                xtype: 'propertygrid',
                source: {
                    "(Naam Waterlichaam)": "Reeuwijkse Plassen",
                    "Code waterlichaam": "NL13_11",
                    "Status": "Kunstmatig",
                    "Type en omschrijving": "M27 - Matig grote ondiepe laagveenplassen",
                    "Provincie": "Zuid-Holland",
                    "Gemeente": "Reeuwijk",
                    "Stroomgebied": "Rijn-West",
                    "Waterbeheergebied": "Hoogheemraadschap van Rijnland"
                }
            }
        },{
			id: 'portlet-2',
			title: 'Communique',
            flex:1,
            html: "Hier kan de analist een kernachtige beschrijving van een gebied invoeren."
		}]
	},{
		id: 'col-a2',
		width: 300,
		items: [{
			id: 'portlet-3',
			title: 'Kaart',
            height:400,
            items: {
                xtype: "image",
			    src: "http://test.krw-waternet.lizardsystem.nl/krw/summary/gaasterplas/tiny_map/"
            }
		}]
	},{
		id: 'col-a3',
		flex:1
	}]
}