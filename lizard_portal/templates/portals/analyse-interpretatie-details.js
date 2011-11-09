/**
* Created by PyCharm.
* User: bastiaanroos
* Date: 19-10-11
* Time: 10:36
* To change this template use File | Settings | File Templates.
*/
{
  itemId: 'analyse-interpretatie-details',
  title: 'Details analyse interpretaties',
  xtype: 'portalpanel',
  items: [{
    width:250,
    items: [{
      title: 'Details',
      flex:1
    },{
      title: 'Workspaces',
      flex:1
    },{
      title: 'Metadata',
      flex:1
    }]
  },{
    flex:1,
    items: [{
      title: 'Analyse interpretatie details',
      flex:1,
      autoScroll: true,
      xtype: "propertygrid",
      width: 300,
      //source: {
        //"(name)": "My Object",
        //"Created": Ext.Date.parse('10/15/2006', 'm/d/Y'),
        //"Available": false,
        //"Version": .01,
        //"Description": "A test object"
      //},
      columns: [],
      store: {
        xtype: 'store',
        storeId: 'analyse_store2',
        autoLoad: true,
        model: Ext.define('newmodel2', {
          extend: 'Ext.data.Model',
          fields: [
            {name: 'title', type: 'string'},
            {name: 'category', type: 'string'},
            {name: 'datetime_period_start', type: 'auto'},
            {name: 'created_by', type: 'string'},
            {name: 'status', type: 'string'},
            {name: 'id', type: 'string'}
          ]
        }),
        proxy: {
          type: 'ajax',
          url: '/annotation/api/grid/',
          extraParams: {
            _accept: 'application/json',
            type: 'interpretatie'
          },
          reader: {
            root: 'objects',
            type: 'json'
          }
        }
      }
    }]
  }]
}
