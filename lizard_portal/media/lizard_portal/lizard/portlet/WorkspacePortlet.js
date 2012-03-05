(function() {
  Ext.define('Lizard.portlet.WorkspacePortlet', {
    extend: 'Ext.grid.Panel',
    mixins: ['Lizard.portlet.Portlet'],
    alias: 'widget.workspaceportlet',
    title: 'Workspace',
    autoHeight: true,
    minHeight: 200,
    viewConfig: {
      getRowClass: function(record, index) {
        var c;
        c = record.get('is_base_layer');
        if (c === true) {
          return 'l-hidden';
        } else {
          return '';
        }
      }
    },
    columns: [
      {
        text: 'aan',
        width: 35,
        dataIndex: 'visibility',
        xtype: 'checkcolumn',
        sortable: true
      }, {
        text: 'sel',
        width: 35,
        dataIndex: 'clickable',
        xtype: 'checkcolumn',
        sortable: true
      }, {
        text: 'Naam',
        flex: 1,
        sortable: true,
        dataIndex: 'name'
      }, {
        text: 'Achtergrond',
        flex: 1,
        visible: false,
        sortable: true,
        dataIndex: 'is_base_layer'
      }
    ],
    loadWorkspace: function(config) {
      var me, params;
      me = this;
      config = config;
      params = config.params || {};
      return this.workspaceStore.load({
        params: {
          object_id: params
        },
        callback: function(records, operation, success) {
          if (me.workspaceStore.layerStore) {
            me.workspaceStore.layerStore.loadData(records[0].get('layers'));
          }
          if (config.callback) {
            return config.callback(records, operation, success);
          }
        }
      });
    },
    tools: [
      {
        type: 'save',
        handler: function(e, target, panelHeader, tool) {
          var portlet;
          portlet = panelHeader.ownerCt;
          return Ext.create('Ext.window.Window', {
            title: 'Bewaar workspace',
            modal: true,
            xtype: 'leditgrid',
            itemId: 'save-workspace',
            finish_edit_function: function(updated_record) {
              debugger;
            },
            editpopup: true,
            items: [
              {
                xtype: 'workspacesaveform',
                workspaceStore: portlet.workspaceStore,
                layerStore: portlet.store
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
            title: 'Beheer workspaces',
            width: 600,
            height: window.innerHeight - 200,
            modal: true,
            layout: {
              type: 'vbox',
              align: 'stretch'
            },
            items: [
              {
                xtype: 'leditgrid',
                flex: 1,
                autoScroll: true,
                proxyUrl: '/workspace/api/workspace_view/',
                proxyParams: {},
                enterEditSummary: false,
                addEditIcon: true,
                addDeleteIcon: true,
                usePagination: false,
                actionEditIcon: function(record) {
                  return portlet.loadWorkspace({
                    params: {
                      object_id: record.get('id')
                    },
                    callback: function(records, operation, success) {
                      if (success) {
                        return form_window.close();
                      } else {
                        return alert('laden mislukt');
                      }
                    }
                  });
                },
                dataConfig: [
                  {
                    name: 'id',
                    title: 'id',
                    editable: false,
                    visible: false,
                    width: 50,
                    type: 'number'
                  }, {
                    name: 'name',
                    title: 'Naam',
                    editable: true,
                    visible: true,
                    width: 150,
                    type: 'text'
                  }, {
                    name: 'personal_category',
                    title: 'persoonlijke tag',
                    editable: true,
                    visible: true,
                    width: 150,
                    type: 'text'
                  }, {
                    name: 'category',
                    title: 'Categorie',
                    editable: true,
                    visible: true,
                    width: 150,
                    type: 'gridcombobox',
                    choices: [
                      {
                        id: 1,
                        name: 'test'
                      }, {
                        id: 2,
                        name: 'testtest'
                      }
                    ]
                  }, {
                    name: 'owner_type',
                    title: 'Type',
                    editable: false,
                    visible: true,
                    width: 150,
                    type: 'gridcombobox'
                  }, {
                    name: 'data_set',
                    title: 'Dataset',
                    editable: false,
                    visible: false,
                    width: 150,
                    type: 'gridcombobox'
                  }, {
                    name: 'owner',
                    title: 'Eigenaar',
                    editable: false,
                    visible: false,
                    width: 150,
                    type: 'gridcombobox'
                  }
                ],
                storeAutoLoad: true
              }
            ]
          }).show();
        }
      }
    ],
    initComponent: function() {
      var me;
      me = this;
      if (!this.workspaceStore) {
        this.workspaceStore = Ext.create(Lizard.store.WorkspaceStore, {
          layerStore: this.store
        });
      }
      return this.callParent(arguments);
    }
  });
}).call(this);
