Ext.define('Lizard.popup.TimeSeriesGraph', {
    extend: 'Ext.form.Panel'

    startValue: null,
    bodyStyle: 'padding:5px 5px 0',
    defaults:
        anchor: '100%'
    width: 300,
    init_background: null

    statics:
        show: (records, workspaceitem) ->
            dt_start = Ext.Date.format(Lizard.CM.getContext().period.start, 'Y-m-d H:i:s')
            dt_end = Ext.Date.format(Lizard.CM.getContext().period.end, 'Y-m-d H:i:s')
            # http://localhost:8000/graph/?dt_start=2011-02-11%2000:00:00&dt_end=2011-11-11%2000:00:00&item={%22fews_norm_source_slug%22:%22waternet%22,%22location%22:%223201%22,%22parameter%22:%22Q_berekend.in.cumulatief%22,%22type%22:%22line%22,%22time_step%22:%22SETS1440TZ1%22}&dt_start=2005-01-01%2000:00:00&dt_end=2011-01-01%2000:00:00
            record = records[0]  # Take first search result
            title = workspaceitem.get('text') + ' - ' + record.data.geo_ident
            collage_item_identifier = {
                geo_ident: record.data.geo_ident
                par_ident: record.data.par_ident
                stp_ident: record.data.stp_ident
                mod_ident: record.data.mod_ident
            }
            collage_item_config = {
                title: workspaceitem.get('text') + ' - ' + record.data.geo_ident
                identifier: collage_item_identifier
                # All workspace item properties here... use copy function??
                ollayer_class: workspaceitem.get('ollayer_class')
                url: workspaceitem.get('url')
                filter: workspaceitem.get('filter')
            }

            Ext.create('Ext.window.Window', {
                title: title,
                modal: true,

                xtype: 'leditgrid'
                itemId: 'map popup'

                finish_edit_function: (updated_record) ->
                #pass

                editpopup: true,
                items: [{
                    xtype: 'panel'
                    width: 1050
                    height: 550
                    html: 'Grafiek voor ' + record.data.geo_ident + ' ' + record.data.par_ident + ' ' + record.data.mod_ident + ' ' + record.data.stp_ident + '<img src="/graph/?dt_start=' + dt_start + '&dt_end=' + dt_end + '&width=1000&height=500&item={%22fews_norm_source_slug%22:%22waternet%22,%22location%22:%22' + record.data.geo_ident + '%22,%22parameter%22:%22' + record.data.par_ident + '%22,%22type%22:%22line%22,%22time_step%22:%22' + record.data.stp_ident + '%22,%22module%22:%22' + record.data.mod_ident + '%22}" />'
                    bbar: [{
                        text: 'Voeg toe aan collage'
                        handler: (btn, event) ->
                            #window = @up('window')
                            #window.close()
                            # WorkspaceItem overnemen
                            collage_store = Lizard.store.CollageStore.get_or_create('analyse')
                            collage_store.collageItemStore.createCollageItem(collage_item_config)
                    }]
                }]
            }).show()

    items: [{
    }],

})