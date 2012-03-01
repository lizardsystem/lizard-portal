" Under construction; just copied from Graph ";
Ext.define('Lizard.model.AppScreen', {
  extend: 'Ext.data.Model',
  fields: [
    {
      name: 'id',
      mapping: 'id',
      type: 'text'
    }, {
      name: 'name',
      mapping: 'name',
      type: 'text'
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
