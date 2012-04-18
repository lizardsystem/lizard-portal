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
      tools: [{
          type: 'plus',
          handler: function (e, target, panelHeader, tool) {
              Ext.create('Ext.window.Window', {
                  title: 'Nieuwe annotatie toevoegen',
                  width: 800,
                  height: 600,
                  modal: true,
                  finish_edit_function: function (updated_record) {
                      //todo
                  },
                  editpopup: true,
                  loader:{
                      loadMask: true,
                      autoLoad: true,
                      url: '/annotation/annotation_detailedit_portal/',
                      baseParams: {
                          area_id: Lizard.CM.getContext().object.id
                      },
                      ajaxOptions: {
                          method: 'GET'
                      },
                      renderer: 'component'
                  }
              }).show();
          }
      } ],
      flex:1,
      items: {
        xtype: 'grid',
        stripeRows: true,
        columnLines: true,
        listeners: {
          itemclick: {
            fn: function(grid, record) {
              console.log(record);
              Ext.getCmp('portalWindow').linkToPopup(
                'Analyseinterpretatie: ' + record.data.title,
                '/annotation/view/' + record.data.id,
                {},
                {
                  save: [
                    'Bewerken analyseinterpretatie: ' + record.data.title,
                    '/annotation/annotation_detailedit_portal/',
                    {annotation_id: record.data.id},
                    null,
                    false,
                    'component',
                    true
                  ],
                  search: [
                    'Geschiedenis',
                    '/annotation/history/1' + record.data.id,
                    {},
                    {},
                    false,
                    'html',
                    false,
                    false
                  ]
                },
                false,
                'html',
                false,
                true
                );
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
        },
        {
          text: 'Categorie',
          flex: 1,
          dataIndex: 'annotation_category',
          sortable: true
        },
        {
          text: 'Status',
          flex: 1,
          dataIndex: 'annotation_status',
          sortable: true
        },
        {
          text: 'Datum laatste wijziging',
          flex: 1,
          dataIndex: 'date_modified',
          sortable: true,
          renderer: Ext.util.Format.dateRenderer('d-m-Y')
        },
        {
          text: 'Auteur',
          flex: 1,
          dataIndex: 'created_by',
          sortable: true
        }
      ],
        store: {
          xtype: 'store',
          storeId: 'analyse_store',
          autoLoad: false,
          model: Ext.define('Analyse_interpretatie', {
            extend: 'Ext.data.Model',
            fields: [
              {name: 'id', type: 'string'},
              {name: 'title', type: 'string'},
              {name: 'annotation_category', type: 'string'},
              {name: 'annotation_status', type: 'string'},
              {name: 'date_modified', type: 'auto'},
              {name: 'created_by', type: 'string'}
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
