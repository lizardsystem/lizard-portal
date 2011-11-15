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
          if (this.store) {
            // Add the object_id to the url before the load
            var url = this.store.getProxy().url;
            url = url + params.object_id + '/';
            this.store.getProxy().url = url;

            this.store.load();
          }
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
    title: 'Omschrijving',
    flex: 1,
    items: [{
      id: 'rrr',
      title: 'Details',
      flex:1,
      items: {
        xtype: 'grid',
        store: "Vss.store.AnnotationDetail",
        hideHeaders: true,
        columns: [
          {
            text: 'Omschrijving',
            flex: 1,
            dataIndex: 'value'
          }]
      }
    }]
  }]
}
