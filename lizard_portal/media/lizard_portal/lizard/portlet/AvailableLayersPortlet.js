
Ext.define('Lizard.portlet.AvailableLayersPortlet', {
  extend: 'Ext.grid.Panel',
  alias: 'widget.availablelayersportlet',
  autoHeight: true,
  minHeight: 200,
  store: Ext.data.StoreManager.lookup('Workspace'),
  columns: [
    {
      text: 'aan',
      width: 35,
      dataIndex: 'visibility',
      xtype: 'checkcolumn',
      sortable: true
    }, {
      text: 'Naam',
      flex: 1,
      sortable: true,
      dataIndex: 'title'
    }
  ]
});
