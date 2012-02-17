# Collection of available apps

Ext.define('Lizard.store.Apps', {
    extend: 'Ext.data.Store',
    model: 'Lizard.model.App',
    # Must be provided from outside
    # data: apps,

    # Apparently required
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    },
});
