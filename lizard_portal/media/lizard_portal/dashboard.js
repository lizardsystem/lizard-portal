(function() {
  Ext.Loader.setConfig({
    disableCaching: false
  });
  Ext.Loader.setPath('Lizard', '/static_media/lizard_portal/lizard');
  Ext.application({
    name: 'lizardViewer',
    launch: function() {
      return Ext.create('Lizard.window.Dashboard');
    }
  });
}).call(this);
