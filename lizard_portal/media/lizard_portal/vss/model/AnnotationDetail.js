Ext.define('Vss.model.AnnotationDetail', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'property', type: 'string'},
        {name: 'value', type: 'auto'}
    ],

    proxy: {
        type: 'ajax',
        url: '/annotation/api/annotation/',
        extraParams: {
            _accept: 'application/json',
            _format: 'property',
            _fields: 'title,category,created_by,datetime_created,status'
        },
        reader: {
          root: 'properties',
          type: 'json'
        }
    }
});

