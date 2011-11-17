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
  items: [{
    width: 250,
    items: [{
      title: 'Details',
      flex:1,
      items: {
        id: 'grid-panel',
        xtype: 'grid',
        stripeRows: true,
        columnLines: true,
        listeners: {
          itemclick: {
            fn: function(grid, record) {
              console.log('Doing nothing.');
            }
          }      
        },
        plugins: [
          Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 2}),
          'applycontext'
        ],
        applyParams: function(params) {
          // Add the object_id to the url before the load
          var url = this.store.getProxy().url;
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
            width:150,
            sortable: true,
            dataIndex: 'property',
            field: {
              allowBlank: false
            }
          },{
            text: 'Waarde',
            flex: 1,
            dataIndex: 'value',
            sortable: true
          }],
          store: "Vss.store.AnnotationDetail",

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
          }
          ]
      }
    }, {
      height: 100,
      title: 'Workspaces'
    }]
  }, {
    flex: 1,
    items: [{
      id: 'description-panel',
      title: 'Omschrijving',
      flex: 1,
      padding: '10 5 10 5',
      store: "Vss.store.AnnotationDetail",
    }]
  }]
}
