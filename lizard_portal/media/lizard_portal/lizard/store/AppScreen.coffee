# Collection of apps selected by User

Ext.define('Lizard.store.AppScreen', {
    extend: 'Ext.data.Store',
    model: 'Lizard.model.AppScreen',
    # data must be provided from outside
    # data: apps,

    # Apparently required
    proxy: {
        type: 'ajax',
        url: '/workspace/api/appscreen'
        extraParams: {
            _accept: 'application/json'
        }
        reader: {
            type: 'json'
            root: 'data'
        }
    }
});
