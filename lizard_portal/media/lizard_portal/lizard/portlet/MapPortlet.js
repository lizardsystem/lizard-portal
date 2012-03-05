(function() {

  Ext.define('Lizard.portlet.MapPortlet', {
    extend: 'GeoExt.panel.Map',
    alias: 'widget.mapportlet',
    title: 'Map',
    tbar: [
      {
        xtype: 'button',
        text: 'test'
      }, '->', {
        fieldLabel: 'Achtergrondkaart',
        name: 'base_layer',
        displayField: 'name',
        valueField: 'id',
        xtype: 'combo',
        queryMode: 'remote',
        typeAhead: false,
        minChars: 0,
        forceSelection: true,
        width: 200,
        store: {
          fields: ['id', 'name'],
          proxy: {
            type: 'ajax',
            url: '/measure/api/organization/?_accept=application%2Fjson&size=id_name',
            reader: {
              type: 'json',
              root: 'data'
            }
          }
        }
      }
    ],
    initComponent: function() {
      var me;
      me = this;
      return this.callParent(arguments);
    }
  });

}).call(this);
