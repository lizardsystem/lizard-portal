(function() {

  Ext.define('Lizard.portlet.WorkspacePortlet', {
    extend: 'Ext.grid.Panel',
    mixins: ['Lizard.portlet.Portlet'],
    alias: 'widget.workspaceportlet',
    title: 'Workspace',
    multiSelect: true,
    read_only: false,
    viewConfig: {
      getRowClass: function(record, index) {
        var c;
        c = record.get('is_base_layer');
        if (c === true) {
          return 'l-grey';
        } else {
          return '';
        }
      },
      plugins: {
        ptype: 'gridviewdragdrop',
        dragGroup: 'workspaceitem',
        dropGroup: 'workspaceitem'
      }
    },
    columns: [
      {
        text: 'aan',
        width: 35,
        dataIndex: 'visibility',
        xtype: 'checkcolumn',
        sortable: false
      }, {
        text: 'selecteerbaar',
        width: 35,
        dataIndex: 'clickable',
        xtype: 'checkcolumn',
        onCheckChange: function(column, record, recordIndex, value) {
          if (value === true) {
            return record.store.setSelectableLayer(record);
          } else {
            return record.store.setSelectableLayer();
          }
        },
        sortable: false
      }, {
        text: 'naam',
        flex: 1,
        sortable: false,
        dataIndex: 'title'
      }, {
        text: 'laad',
        width: 35,
        sortable: false,
        xtype: 'loadingcolumn',
        dataIndex: 'loading'
      }
    ],
    clear: function() {
      var background_pref, index, old_background;
      index = this.workspaceStore.workspaceItemStore.find('is_base_layer', true);
      old_background = this.workspaceStore.workspaceItemStore.getAt(index);
      this.workspaceStore.workspaceItemStore.removeAll();
      this.workspaceStore.removeAll();
      background_pref = Lizard.CM.getContext().background_layer;
      if (background_pref) {
        return this.workspaceStore.workspaceItemStore.insert(0, background_pref);
      } else {
        return this.workspaceStore.workspaceItemStore.insert(0, old_background);
      }
    },
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
          if (config.callback) return config.callback(records, operation, success);
        }
      });
    },
    tools: true,
    onClick: function(view, record, item, index, event, eOpts) {
      arguments;      debugger;
    },
    create_workspace_window: function(portlet) {
      var config, form_window;
      portlet = portlet;
      config = {
        extend: 'Ext.grid.Panel',
        title: 'Beheer workspaces',
        width: 1000,
        height: 600,
        modal: true,
        constrainHeader: true,
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
            addEditIcon: false,
            addDeleteIcon: true,
            usePagination: false,
            useAddDeleteButtons: false,
            read_only_field: 'read_only',
            addExtraActionIcon: true,
            extraActionIconUrl: '/static_media/lizard_portal/images/hand.png',
            extraActionIconTooltip: 'openen',
            actionExtraActionIcon: function(record) {
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
                width: 250,
                type: 'text'
              }, {
                name: 'personal_category',
                title: 'persoonlijke tag',
                editable: true,
                visible: true,
                width: 200,
                type: 'text'
              }, {
                name: 'owner_type',
                title: 'Type',
                editable: true,
                visible: true,
                width: 80,
                type: 'gridcombobox',
                choices: [
                  {
                    id: 0,
                    name: 'User'
                  }, {
                    id: 2,
                    name: 'Public'
                  }, {
                    id: 3,
                    name: 'Organisatie'
                  }
                ]
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
                visible: true,
                width: 100,
                type: 'gridcombobox'
              }, {
                name: 'read_only',
                title: 'alleen_lezen',
                editable: false,
                visible: false,
                width: 50,
                type: 'boolean'
              }, {
                name: 'datetime_created',
                title: 'aangemaakt',
                editable: false,
                visible: true,
                width: 150,
                type: 'text'
              }, {
                name: 'datetime_modified',
                title: 'gewijzigd',
                editable: false,
                visible: true,
                width: 150,
                type: 'text'
              }
            ],
            storeAutoLoad: true
          }
        ]
      };
      if (this.read_only) {
        config.items[0].editable = false;
        config.items[0].addDeleteIcon = false;
      }
      return form_window = Ext.create('Ext.window.Window', config).show();
    },
    tools: [
      {
        type: 'save',
        tooltip: 'Workspace opslaan',
        handler: function(e, target, panelHeader, tool) {
          var portlet;
          portlet = panelHeader.ownerCt;
          return Ext.create('Ext.window.Window', {
            title: 'Bewaar workspace',
            modal: true,
            xtype: 'leditgrid',
            editpopup: true,
            constrainHeader: true,
            items: [
              {
                xtype: 'workspacesaveform',
                workspaceStore: portlet.workspaceStore,
                layerStore: portlet.workspaceStore.workspaceItemStore,
                save_callback: function(record) {}
              }
            ]
          }).show();
        }
      }, {
        type: 'gear',
        tooltip: 'Workspace beheer',
        handler: function(e, target, panelHeader, tool) {
          var a, portlet;
          portlet = panelHeader.ownerCt;
          a = portlet.html;
          return portlet.create_workspace_window(portlet);
        }
      }, {
        type: 'delete-single',
        tooltip: 'Workspace item verwijderen (na selectie)',
        handler: function(e, target, panelHeader, tool) {
          var portlet, records;
          portlet = panelHeader.ownerCt;
          records = portlet.getSelectionModel().selected.items;
          return portlet.store.remove(records);
        }
      }, {
        type: 'delete',
        tooltip: 'Workspace legen',
        handler: function(e, target, panelHeader, tool) {
          var portlet;
          portlet = panelHeader.ownerCt;
          return portlet.clear();
        }
      }
    ],
    initComponent: function() {
      var me;
      me = this;
      this.store = this.workspaceStore.workspaceItemStore;
      if (me.read_only) me.tools[0].disabled = true;
      Ext.apply(this, {
        listeners: {
          itemclick: this.onClick
        }
      });
      return this.callParent(arguments);
    }
  });

}).call(this);
