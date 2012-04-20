Ext.define('Lizard.popup.AnnotationPopup', {
    extend: 'Ext.form.Panel'

    startValue: null,
    bodyStyle: 'padding:5px 5px 0',
    defaults:
        anchor: '100%'
    width: 300,
    init_background: null

    statics:
      show: (records, workspaceitem) ->
        Ext.getCmp('portalWindow').linkToPopup(
          'Analyseinterpretatie: ' + records[0].data.title,
          '/annotation/view/' + records[0].data.id,
          {},
          {
            save: [
              'Bewerken analyseinterpretatie: ' + records[0].data.title,
              '/annotation/annotation_detailedit_portal/',
              {annotation_id: records[0].data.id},
              null,
              false,
              'component',
              true
            ],
            search: [
              'Geschiedenis',
              '/annotation/history/' + records[0].data.id,
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
    items: [{
    }],
})
