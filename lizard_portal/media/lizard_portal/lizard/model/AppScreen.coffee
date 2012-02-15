""" Under construction; just copied from Graph """

Ext.define('Lizard.model.AppScreen', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            mapping: 'id',
            type: 'text'
        },{
            name: 'name',
            mapping: 'name',
            type: 'text'
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
