(function() {
  Ext.application({
    name: 'lizardViewer',
    launch: function() {
      return Ext.create('Lizard.Window.Viewer');
    }
  });
}).call(this);
