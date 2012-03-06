""" Under construction; just copied from Graph """

Ext.define('Lizard.model.AppScreen', {
    extend: 'Ext.data.Model',
    idProperty: 'slug',
    fields: [
        {
            name: 'slug',
            mapping: 'slug',
            type: 'text'
        },{
            name: 'name',
            mapping: 'name',
            type: 'text'
        },{
            name: 'apps',
            mapping: 'apps',
            type: 'auto'
        }
    ],


    statics:
        getGraphUrl: (values) ->
            url = 'http://vul.mij.in';
            return url

        getDownloadUrl: (values) ->
            url = @getGraphUrl(values)
            url += '&format=csv'

});
