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
//    plugins: [
//      'applycontext'
//    ],
      autoScroll: true,
//    loader: {
//      ajaxOptions: {
//        method: 'GET'
//      },
//      loadMask: true,
//      url: '/annotation/api/annotation/',
//      autoLoad: false,
//      baseParams: {
//        _accept: 'text/html',
//        portalTemplate: 'eigenschappen'
//      }
//    },
      xtype: "propertygrid",
      width: 300,
//    renderTo: Ext.getBody(),
      source: {
       "(name)": "My Object",
       "Created": Ext.Date.parse('10/15/2006', 'm/d/Y'),
       "Available": false,
       "Version": .01,
       "Description": "A test object"
      }
//    applyParams: function(params) {
//      var me = this;
//      me.getLoader().load({
//        url: '/annotation/api/annotation/' + params.object_id,
//        params: {
//          object_id: params.object_id,

//        }
//      });
//    }
    }]
  }]
}
