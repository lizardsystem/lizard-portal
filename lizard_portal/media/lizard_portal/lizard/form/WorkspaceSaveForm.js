(function() {
  Ext.define('Lizard.form.WorkspaceSaveForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.workspacesaveform',
    defaultType: 'textfield',
    bodyStyle: 'padding:5px',
    defaults: {
      anchor: '100%'
    },
    width: 400,
    items: [
      {
        xtype: 'radiogroup',
        name: 'save_method',
        fieldLabel: 'Overschrijven?',
        columns: 1,
        vertical: true,
        items: [
          {
            boxLabel: 'Geladen workspace overschrijven',
            name: 'method',
            inputValue: 'update'
          }, {
            boxLabel: 'Opslaan als nieuwe workspace',
            name: 'method',
            inputValue: 'create'
          }
        ]
      }, {
        fieldLabel: 'Naam',
        name: 'name',
        allowBlank: false
      }, {
        fieldLabel: 'Persoonlijk tag',
        name: 'personal_category',
        allowBlank: true
      }
    ],
    bbar: [
      {
        text: 'Annuleren',
        handler: function(btn, event) {
          var window;
          window = this.up('window');
          return window.close();
        }
      }, {
        text: 'Opslaan',
        handler: function(btn, event) {
          var form, form_values, layers, order_nr, window, workspace, workspace_layers;
          form = this.up('form').getForm();
          if (form.isValid()) {
            form_values = form.getValues();
            if (form_values.method === 'update') {
              workspace = form.workspaceStore.first();
            } else {
              workspace = Ext.create('Lizard.model.WorkspaceModel', {});
            }
            workspace.set('name', form_values.name);
            workspace.set('personal_category', form_values.personal_category);
            layers = form.layerStore;
            workspace_layers = [];
            order_nr = 0;
            layers.each(function(record) {
              record.order = order_nr;
              order_nr += 1;
              workspace_layers.push(record.store.proxy.writer.getRecordData(record));
            });
            workspace.set('layers', workspace_layers);
            workspace.save();
            window = this.up('window');
            return window.close();
          } else {
            return Ext.MessageBox.alert('Invoer fout', 'Kies geldige periode');
          }
        }
      }
    ],
    afterRender: function() {
      var form, save_method;
      form = this.getForm();
      save_method = form.findField('save_method');
      if (this.workspaceStore.getTotalCount() > 0) {
        save_method = form.findField('save_method');
        save_method.setValue({
          method: 'update'
        });
        form.findField('name').setValue(this.workspaceStore.first().get('name'));
        return form.findField('personal_category').setValue(this.workspaceStore.first().get('personal_category'));
      } else {
        save_method.setValue({
          method: 'create'
        });
        return save_method.setDisabled(true);
      }
    }
  });
}).call(this);
