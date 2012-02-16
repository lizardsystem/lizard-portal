"""Just copied"""

Ext.define('Lizard.store.AppScreen', {
    extend: 'Ext.data.Store',
    model: 'Lizard.model.AppScreen',
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

        ## TODO: do something with arguments

        @context_ready = true


});
