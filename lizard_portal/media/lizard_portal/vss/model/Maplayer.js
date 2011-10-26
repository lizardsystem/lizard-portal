/**
 * Created by PyCharm.
 * User: bastiaanroos
 * Date: 24-10-11
 * Time: 21:29
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Vss.model.Maplayer', {
    extend: 'Ext.data.Model',
    fields: ['id', 'name', 'artist', 'album', 'played_date', 'station'],

    proxy: {
        type: 'rest',
        url: 'data/recentsongs.json',
        extraParams: {
            _accept: 'application/json'
        },
        reader: {
            type: 'json',
            root: 'communique'
        }
    }
});