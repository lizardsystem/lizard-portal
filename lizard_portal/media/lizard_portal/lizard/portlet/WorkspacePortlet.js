
Ext.define('Lizard.portlet.WorkspacePortlet', {
  extend: 'Ext.grid.Panel',
  mixins: ['Lizard.portlet.Portlet'],
  alias: 'widget.workspaceportlet',
  title: 'Workspace',
  autoHeight: true,
  minHeight: 200,
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
  ],
  tools: [
    {
      type: 'save',
      handler: function(e, target, panelHeader, tool) {
        var a, portlet;
        portlet = panelHeader.ownerCt;
        a = portlet.html;
        return Ext.create('Ext.window.Window', {
          title: 'Bewaar workspace',
          width: 400,
          height: 500,
          modal: true,
          xtype: 'leditgrid',
          itemId: 'save-workspace',
          finish_edit_function: function(updated_record) {},
          editpopup: true,
          items: [
            {
              xtype: 'workspacesaveform'
            }
          ]
        }).show();
      }
    }, {
      type: 'gear',
      handler: function(e, target, panelHeader, tool) {
        var a, form_window, portlet;
        portlet = panelHeader.ownerCt;
        a = portlet.html;
        return form_window = Ext.create('Ext.window.Window', {
          extend: 'Ext.grid.Panel',
          alias: 'widget.manageworkspacesportlet',
          title: 'Beheer workspaces',
          width: 800,
          height: 600,
          modal: true,
          items: [
            {
              xtype: 'leditgrid',
              proxyUrl: '/workspace/api/workspace/',
              proxyParams: {},
              dataConfig: [
                {
                  name: 'id',
                  title: 'id',
                  editable: false,
                  visible: true,
                  width: 50,
                  type: 'text'
                }, {
                  name: 'name',
                  title: 'Naam',
                  editable: true,
                  visible: true,
                  width: 150,
                  type: 'text'
                }, {
                  name: 'owner_id',
                  title: 'Eigenaar',
                  editable: true,
                  visible: true,
                  width: 150,
                  type: 'text'
                }
              ],
              storeAutoLoad: true,
              enterEditSummary: false
            }
          ]
        }).show();
      }
    }
  ],
  initComponent: function() {
    var me;
    me = this;
    return this.callParent(arguments);
  }
});
