(function() {
  Ext.define('Lizard.grid.EditableGrid', {
    extend: 'Ext.container.grid',
    plugin: [
      Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
      })
    ],
    uses: ['Ext.grid.*', 'Ext.data.*', 'Ext.button.*', 'Lizard.ux.CheckColumn', 'Ext.MessageBox'],
    config: {
      special: true
    },
    onCancel: function() {},
    onSave: function() {},
    getModel: function() {},
    getStore: function() {
      return Ext.create('Ext.data.TreeStore', {
        proxy: {
          type: 'ajax',
          url: '/portal/example_treedata.json',
          extraParams: {
            isJSON: true
          },
          reader: {
            type: 'json'
          }
        }
      });
    },
    getProxy: function() {},
    initComponent: function(arguments) {
      var bbar_config;
      bbar_config = [
        {
          xtype: 'button',
          title: 'cancel',
          handler: function() {
            return alert('cancel');
          }
        }, {
          xtype: 'button',
          title: 'save',
          handler: function() {
            return alert('save');
          }
        }
      ];
      Ext.apply(this, {
        layout: {
          collapsible: false,
          floatable: false,
          frame: false
        },
        bbar: bbar_config
      });
      Lizard.grid.EditableGrid.superclass.initComponent.apply(this, arguments);
      return this;
    }
  });
}).call(this);
