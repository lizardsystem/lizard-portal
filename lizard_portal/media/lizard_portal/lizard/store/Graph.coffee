
Ext.define('Lizard.store.Graph', {
    extend: 'Ext.data.Store',
    model: 'Lizard.model.Graph',
    config: {
        context_ready:false

    }
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    },
    applyContext: (changes, context) ->
        console.arguments

        for rec in @data.items

            rec.set('dt_start', Ext.Date.format(context.period_start,'Y-m-d H:i:s'))
            rec.set('dt_end', Ext.Date.format(context.period_end,'Y-m-d H:i:s'))
            if rec.get('use_context_location')
                rec.set('location', context.object_id)

        @context_ready = true


});
