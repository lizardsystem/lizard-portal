(function() {
  " Under construction; just copied from Graph ";  Ext.define('Lizard.model.AppScreen', {
    extend: 'Ext.data.Model',
    idProperty: 'slug',
    fields: [
      {
        name: 'slug',
        mapping: 'slug',
        type: 'text'
      }, {
        name: 'name',
        mapping: 'name',
        type: 'text'
      }, {
        name: 'apps',
        mapping: 'apps',
        type: 'auto'
      }
    ],
    statics: {
      getGraphUrl: function(values) {
        var url;
        url = 'http://vul.mij.in';
        return url;
      },
      getDownloadUrl: function(values) {
        var url;
        url = this.getGraphUrl(values);
        return url += '&format=csv';
      }
    }
  });
}).call(this);
