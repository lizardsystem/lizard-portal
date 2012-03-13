(function() {

  Ext.define('Lizard.portlet.CollagePortlet', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.collageportlet',
    title: 'Collage',
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
        dragGroup: 'collageitem',
        dropGroup: 'collageitem'
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
        dataIndex: 'title'
      }
    ],
    clear: function() {
      this.collageStore.collageItemStore.removeAll();
      return this.collageStore.removeAll();
    },
    loadCollage: function(config) {
      var me, params;
      me = this;
      config = config;
      params = config.params || {};
      return this.collageStore.load({
        params: {
          object_id: params
        },
        callback: function(records, operation, success) {
          if (config.callback) return config.callback(records, operation, success);
        }
      });
    },
    tools: [
      {
        type: 'unpin',
        handler: function(e, target, panelHeader, tool) {
          var portlet;
          portlet = panelHeader.ownerCt;
          return portlet.clear();
        }
      }, {
        type: 'save',
        handler: function(e, target, panelHeader, tool) {
          var portlet;
          portlet = panelHeader.ownerCt;
          return Ext.create('Ext.window.Window', {
            title: 'Bewaar collage',
            modal: true,
            xtype: 'leditgrid',
            editpopup: true,
            items: [
              {
                xtype: 'collagesaveform',
                collageStore: portlet.collageStore,
                layerStore: portlet.collageStore.collageItemStore,
                save_callback: function(record) {}
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
            title: 'Beheer collages',
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
                proxyUrl: '/workspace/api/collage_view/',
                proxyParams: {},
                enterEditSummary: false,
                addEditIcon: true,
                addDeleteIcon: true,
                usePagination: false,
                read_only_field: 'read_only',
                actionEditIcon: function(record) {
                  return portlet.loadCollage({
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
                    editable: false,
                    visible: true,
                    width: 60,
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
                  }, {
                    name: 'read_only',
                    title: 'alleen_lezen',
                    editable: false,
                    visible: false,
                    width: 50,
                    type: 'boolean'
                  }
                ],
                storeAutoLoad: true
              }
            ]
          }).show();
        }
      }, {
        type: 'pin',
        handler: function(e, target, panelHeader, tool) {
          var portlet, records;
          portlet = panelHeader.ownerCt;
          records = portlet.getSelectionModel().selected.items;
          return portlet.store.remove(records);
        }
      }
    ],
    initComponent: function() {
      var me;
      me = this;
      this.store = this.collageStore.collageItemStore;
      return this.callParent(arguments);
    }
  });

}).call(this);
