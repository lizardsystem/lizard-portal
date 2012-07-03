Ext.define('Lizard.popup.FeatureInfo', {
    extend: 'Ext.form.Panel'

    startValue: null,
    bodyStyle: 'padding:5px 5px 0',
    defaults:
        anchor: '100%'
    width: 300,
    init_background: null

    statics:
        show: (records, workspaceitem) ->
            record = records[0]

            data = []

            Ext.Object.each(record.data, (key, value)->
                data.push({key:key, value:value})
            )

            tpl = new Ext.XTemplate(
                """
                <div class="lizard">
                  <h2>Kaartlaag: {layer_name}</h2>
                  <table>
                    <tr>
                        <th style="width:50px;">Veld</th>
                        <th style="width:50px;">Waarde</th>
                    </tr>
                    <tpl for="fields">
                      <tr>
                          <td style="width:50px;">{key}</td>
                          <td style="width:50px;">{value}</td>
                      </tr>
                    </tpl>
                  </table>
                </div>
                """
            );
            html = tpl.applyTemplate({
                layer_name: workspaceitem.get('title'),
                fields:data
            });

            Ext.create('Ext.window.Window', {
                title: 'Info',
                popup_type: 'feature_info'
                constrainHeader: true,
                items: [{
                    xtype: 'panel'
                    width: 400
                    html: html
                }]
            }).show()

    items: [{
    }],

})
