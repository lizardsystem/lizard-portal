(function() {

  Ext.define('Lizard.portlet.AppScreenPortlet', {
    extend: 'Lizard.portlet.Portlet',
    alias: 'widget.appscreenportlet',
    config: {
      graph_service_url: '',
      graphs: [],
      context_manager: []
    },
    initComponent: function() {
      var me;
      me = this;
      Ext.apply(this, {
        layout: {
          type: 'vboxscroll',
          align: 'stretch'
        },
        defaults: {
          flex: 1,
          height: 250
        },
        autoScroll: true,
        tbar: ['Apps:'],
        items: [],
        tools: [
          {
            type: 'plus',
            handler: function(e, target, panelHeader, tool) {
              var portlet;
              portlet = panelHeader.ownerCt;
              if (tool.type === 'plus') {
                tool.setType('minus');
                return me.setGraphFit(false);
              } else {
                tool.setType('plus');
                return me.setGraphFit(true);
              }
            }
          }
        ]
      });
      console.log('cm');
      console.log(this.context_manager);
      return this.callParent(arguments);
    }
  });

}).call(this);
