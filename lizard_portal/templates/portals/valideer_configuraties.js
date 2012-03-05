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
                           title: "Valideer",
                           flex:1,
                           autoScroll: true,
                           bbar: [{
				      xtype: "button",
                                      text: "valideer",
                                      handler: function(button){
                                          Ext.Ajax.request({
                                                  method:"POST",
                                                  params: {test:"test"},
                                                  reader: {type:"json", root: "data", successful: "successful"},
                                                  success: function() {alert("gelukt");},
                                                  failure: function() {alert("mislukt");}
							   });
                                      }
                                  }]
                       }]
           }]
}
