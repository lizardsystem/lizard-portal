Ext.define('Lizard.popup.TimeSeriesGraph', {
    extend: 'Ext.form.Panel'

    startValue: null,
    bodyStyle: 'padding:5px 5px 0',
    defaults:
        anchor: '100%'
    width: 300,
    init_background: null

    statics:
        # There are currently 2 ways to come here: either after
        # clicking on the map, or from a collage. If called from a
        # collage, the property records[0].data.is_collage_item is set
        # to true and the workspace item is artificially created.
        show: (records, workspaceitem) ->
            dt_start = Ext.Date.format(Lizard.CM.getContext().period.start, 'Y-m-d H:i:s')
            dt_end = Ext.Date.format(Lizard.CM.getContext().period.end, 'Y-m-d H:i:s')
            # http://localhost:8000/graph/?dt_start=2011-02-11%2000:00:00&dt_end=2011-11-11%2000:00:00&item={%22fews_norm_source_slug%22:%22waternet%22,%22location%22:%223201%22,%22parameter%22:%22Q_berekend.in.cumulatief%22,%22type%22:%22line%22,%22time_step%22:%22SETS1440TZ1%22}&dt_start=2005-01-01%2000:00:00&dt_end=2011-01-01%2000:00:00

            record = records[0]  # Take first search result as leading

            # Build info for "Voeg toe aan collage"
            collage_item_identifier = {
                # record: record
                geo_ident: record.data.geo_ident
                par_ident: record.data.par_ident
                stp_ident: record.data.stp_ident
                mod_ident: record.data.mod_ident
                qua_ident: record.data.qua_ident
                fews_norm_source_slug: record.data.fews_norm_source_slug
            }
            collage_item_config = {
                name: workspaceitem.get('title') + ' - ' + record.data.geo_ident
                title: workspaceitem.get('title') + ' - ' + record.data.geo_ident  # Will appear on screen.. why?
                plid: workspaceitem.get('plid')  # Layer.id
                js_popup_class: workspaceitem.get('js_popup_class')  # Only for 'unsaved' collage items - needs refactoring.
                identifier: Ext.JSON.encode(collage_item_identifier)
                grouping_hint: 'tijdreeks ' + record.data.par_ident
            }

            # Add all graphs
            graph_item_html = ''
            for single_record in records
                if single_record.data.qua_ident
                    qua_ident_extra = ',%22qua_ident%22:%22' + single_record.data.qua_ident + '%22'
                else
                    qua_ident_extra = ''
                graph_item_html += '&item={%22fews_norm_source_slug%22:%22' + single_record.data.fews_norm_popup_slug + '%22,%22location%22:%22' + single_record.data.geo_ident + '%22,%22parameter%22:%22' + single_record.data.par_ident + '%22,%22type%22:%22line%22,%22time_step%22:%22' + single_record.data.stp_ident + '%22,%22module%22:%22' + single_record.data.mod_ident + '%22' + qua_ident_extra + '}'
            img_html = '<img src="/graph/?dt_start=' + dt_start + '&dt_end=' + dt_end + '&width=1000&height=550&legend-location=4' + graph_item_html + '" />'

            # Button bar for popup "Voeg to aan collage".
            if record.data.is_collage_item == true
                graph_title = 'Collage popup voor ' + record.data.grouping_hint
                title = record.data.grouping_hint
                bbar = [{
                    text: 'Ga naar collagescherm'
                    handler: (btn, event) ->
                        # Push current collage to server
                        # Wait for server to respond, then open the collage page in separate window.
                }]
            else
                graph_title = 'Grafiek voor ' + record.data.geo_ident + ' ' + record.data.par_ident + ' ' + record.data.mod_ident + ' ' + record.data.stp_ident
                title = workspaceitem.get('title') + ' - ' + record.data.geo_ident
                bbar = [{
                    text: 'Voeg toe aan collage'
                    handler: (btn, event) ->
                        #window = @up('window')
                        #window.close()
                        # WorkspaceItem overnemen
                        collage_store = Lizard.store.CollageStore.get_or_create('analyse')
                        collage_store.collageItemStore.createCollageItem(collage_item_config)
                }]

            bbar.push('->')
            bbar.push({
                text: 'Download csv'
                handler: (btn, event) ->
                    window.open('/graph/?dt_start=' + dt_start + '&dt_end=' + dt_end + graph_item_html + '&format=csv', 'download')
            })

            Ext.create('Ext.window.Window', {
                title: title,
                modal: true,

                xtype: 'leditgrid'
                itemId: 'map popup'

                finish_edit_function: (updated_record) ->
                #pass

                editpopup: true,
                constrainHeader: true,
                items: [{
                    xtype: 'panel'
                    width: 1050
                    height: 600
                    html: graph_title + img_html
                    bbar: bbar
                }]
            }).show()

    items: [{
    }],

})
