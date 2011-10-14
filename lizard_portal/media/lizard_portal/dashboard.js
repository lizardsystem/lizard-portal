(function() {
  Ext.Loader.setConfig({
    disableCaching: false
  });
  Ext.Loader.setPath('Lizard', '/static_media/lizard_portal/lizard');
  Ext.application({
    name: 'lizardViewer',
    launch: function() {
      var pw;
      Ext.create('Lizard.window.Dashboard');
      pw = Ext.getCmp('portalWindow');
      return pw.loadPortal({
        portalTemplate: 'homepage'
      });
    }
  });
}).call(this);
