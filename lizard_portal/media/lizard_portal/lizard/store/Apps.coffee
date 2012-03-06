# Collection of available apps
# Do we need this store????

Ext.define('Lizard.store.Apps', {
    extend: 'Ext.data.Store',
    model: 'Lizard.model.App',
    # Must be provided from outside
    # data: apps,
    autoLoad:false

    # Apparently required

});
