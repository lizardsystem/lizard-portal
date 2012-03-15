(function() {

  Ext.define('Lizard.popup.TimeSeriesGraph', {
    extend: 'Ext.form.Panel',
    startValue: null,
    bodyStyle: 'padding:5px 5px 0',
    defaults: {
      anchor: '100%'
    },
    width: 300,
    init_background: null,
    statics: {
      show: function(records, workspaceitem) {
        var bbar, collage_item_config, collage_item_identifier, dt_end, dt_start, record, title;
        dt_start = Ext.Date.format(Lizard.CM.getContext().period.start, 'Y-m-d H:i:s');
        dt_end = Ext.Date.format(Lizard.CM.getContext().period.end, 'Y-m-d H:i:s');
        record = records[0];
        title = workspaceitem.get('text') + ' - ' + record.data.geo_ident;
        debugger;
        collage_item_identifier = {
          geo_ident: record.data.geo_ident,
          par_ident: record.data.par_ident,
          stp_ident: record.data.stp_ident,
          mod_ident: record.data.mod_ident,
          qua_ident: record.data.qua_ident,
          fews_norm_source_slug: record.data.fews_norm_source_slug
        };
        collage_item_config = {
          name: workspaceitem.get('text') + ' - ' + record.data.geo_ident,
          title: workspaceitem.get('text') + ' - ' + record.data.geo_ident,
          plid: workspaceitem.get('plid'),
          js_popup_class: workspaceitem.get('js_popup_class'),
          identifier: Ext.JSON.encode(collage_item_identifier)
        };
        if (record.data.is_collage_item === true) {
          bbar = [];
        } else {
          bbar = [
            {
              text: 'Voeg toe aan collage',
              handler: function(btn, event) {
                var collage_store;
                collage_store = Lizard.store.CollageStore.get_or_create('analyse');
                return collage_store.collageItemStore.createCollageItem(collage_item_config);
              }
            }
          ];
        }
        return Ext.create('Ext.window.Window', {
          title: title,
          modal: true,
          xtype: 'leditgrid',
          itemId: 'map popup',
          finish_edit_function: function(updated_record) {},
          editpopup: true,
          items: [
            {
              xtype: 'panel',
              width: 1050,
              height: 550,
              html: 'Grafiek voor ' + record.data.geo_ident + ' ' + record.data.par_ident + ' ' + record.data.mod_ident + ' ' + record.data.stp_ident + '<img src="/graph/?dt_start=' + dt_start + '&dt_end=' + dt_end + '&width=1000&height=500&item={%22fews_norm_source_slug%22:%22waternet%22,%22location%22:%22' + record.data.geo_ident + '%22,%22parameter%22:%22' + record.data.par_ident + '%22,%22type%22:%22line%22,%22time_step%22:%22' + record.data.stp_ident + '%22,%22module%22:%22' + record.data.mod_ident + '%22}" />',
              bbar: bbar
            }
          ]
        }).show();
      }
    },
    items: [{}]
  });

}).call(this);
