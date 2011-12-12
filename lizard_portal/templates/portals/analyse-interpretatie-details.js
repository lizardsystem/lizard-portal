// jslint configuration
/*jslint browser: true */
/*global
Ext, console
*/

/**
* Created by PyCharm.
* User: bastiaanroos
* Date: 19-10-11
* Time: 10:36
* To change this template use File | Settings | File Templates.
*/
{
  itemId: 'analyse-interpretatie-details',
  title: 'Analyse interpretaties details',
  xtype: 'portalpanel',
  breadcrumbs: [
    {
        name: 'watersysteemkaart',
        link: 'homepage'
    },
    {
        name: 'Overzicht analyse interpretaties',
        link: 'analyse-interpretatie'
    },
    {
        name: 'Analyse interpretaties details'
    }
  ],
  items: [{
    width: 250,
    items: [{
      title: 'Details',
      height: 200,
      items: {
        id: 'grid-panel',
        xtype: 'grid',
        hideHeaders: true,
        stripeRows: true,
        columnLines: true,
        plugins: [
          'applycontext'
        ],
        applyParams: function(params) {
          // Add the object_id to the url before the load
          var url = '/annotation/api/annotation/';
          url = url + params.object_id + '/';
          this.store.getProxy().url = url;

          // Load the store
          this.store.load(function(records, operation, success) {
            // And set the description HTML on the description panel
            var descriptionProperty = Ext.Array.filter(
              records, 
              function(el){return el.data.property === "description"}
            )[0];
            var descriptionHtml = descriptionProperty.data.value;
            Ext.getCmp('description-panel').add({html: descriptionHtml});
          });
        },
        columns: [
          {
            text: 'Eigenschap',
            width:100,
            sortable: true,
            dataIndex: 'property'
          },{
            text: 'Waarde',
            flex: 1,
            dataIndex: 'value',
            sortable: true
          }],
          store: "Vss.store.AnnotationDetail"  
      }
    }, {
      flex:1,
      title: 'Referenties'
    }]
  }, {
    flex: 1,
    items: [{
      id: 'description-panel',
      title: 'Omschrijving',
      flex: 1,
      padding: '10 5 10 5',
      store: "Vss.store.AnnotationDetail"
    }]
  }]
}
