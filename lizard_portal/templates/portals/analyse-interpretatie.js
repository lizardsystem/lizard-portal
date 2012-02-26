/**
* Created by PyCharm.
* User: bastiaanroos
* Date: 19-10-11
* Time: 10:36
* To change this template use File | Settings | File Templates.
*/
{
  itemId: 'analyse-interpretatie',
  title: 'Overzicht analyse interpretaties',
  xtype: 'portalpanel',
  breadcrumbs: [
    {
        name: 'watersysteemkaart',
        link: 'homepage'
    },
    {
        name: 'Overzicht analyse interpretaties'
    }
  ],
  items: [{
    flex:1,
    items: [{
      title: 'Analyse interpretatie',
      flex:1,
      items: {
        xtype: 'grid',
        stripeRows: true,
        columnLines: true,
        listeners: {
          itemclick: {
            fn: function(grid, record) {
              console.log(record);
              Ext.getCmp('portalWindow').linkTo({
                object:'analyse-interpretatie',
                object_id:record.data.id,
                portal_template:'analyse-interpretatie-details'
              }) ;
            }
          }      
        },
        plugins: [
          'applycontext'
        ],
        applyParams: function(params) {
            //this.store.applyParams({object_id: params.object_id});
            this.store.load({params: {object_ident: params.object.id}});
        },
      columns: [
        {
          text: 'Titel',
          width:150,
          sortable: true,
          dataIndex: 'title'
        },{
          text: 'Categorie',
          flex: 1,
          dataIndex: 'category',
          sortable: true
        },{
          text: 'Begin periode',
          flex: 1,
          dataIndex: 'datetime_period_start',
          sortable: true
          //renderer: formatDate,
        },{
          text: 'Eind periode',
          flex: 1,
          dataIndex: 'datetime_period_end',
          sortable: true
          //renderer: formatDate,
        },{
          text: 'Status',
          flex: 1,
          dataIndex: 'status',
          sortable: true
        },{
          text: 'Auteur',
          flex: 1,
          dataIndex: 'created_by',
          sortable: true
        }],
        store: {
          xtype: 'store',
          storeId: 'analyse_store',
          autoLoad: false,
          model: Ext.define('Analyse_interpretatie', {
            extend: 'Ext.data.Model',
            fields: [
              {name: 'title', type: 'string'},
              {name: 'category', type: 'string'},
              {name: 'datetime_period_start', type: 'auto'},
              {name: 'datetime_period_end', type: 'auto'},
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
              object_ident: null/* ,
              type: 'analyse_interpretatie'*/
            },
            reader: {
              root: 'annotations',
              type: 'json'
            }
          }
        }

      }
    }]
  }]
}
