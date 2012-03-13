(function() {

  Ext.define('Lizard.form.CollageSaveForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.collagesaveform',
    defaultType: 'textfield',
    bodyStyle: 'padding:5px',
    defaults: {
      anchor: '100%'
    },
    width: 400,
    save_callback: Ext.emptyFn,
    items: [
      {
        xtype: 'radiogroup',
        name: 'save_method',
        fieldLabel: 'Overschrijven?',
        columns: 1,
        vertical: true,
        items: [
          {
            boxLabel: 'Geladen collage overschrijven',
            name: 'method',
            inputValue: 'update'
          }, {
            boxLabel: 'Opslaan als nieuwe collage',
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
          var collage, collage_layers, form, form_values, layers, order_nr, panel, window;
          panel = this.up('form');
          form = panel.getForm();
          if (form.isValid()) {
            form_values = form.getValues();
            if (form_values.method === 'update') {
              collage = form.collageStore.first();
            } else {
              collage = Ext.create('Lizard.model.CollageModel', {});
            }
            collage.set('name', form_values.name);
            collage.set('personal_category', form_values.personal_category);
            layers = form.layerStore;
            collage_layers = [];
            order_nr = 0;
            layers.each(function(record) {
              record.order = order_nr;
              order_nr += 1;
              record.commit();
              collage_layers.push(record.store.proxy.writer.getRecordData(record));
            });
            collage.set('layers', collage_layers);
            collage.save({
              callback: function(record, operation) {
                if (operation.wasSuccessful()) {
                  form.collageStore.removeAll();
                  form.collageStore.add(record);
                  return panel.save_callback(record);
                }
              }
            });
            window = this.up('window');
            return window.close();
          } else {
            return Ext.MessageBox.alert('Invoer fout', 'Kies geldige periode');
          }
        }
      }
    ],
    afterRender: function() {
      var bla, form, save_method;
      form = this.getForm();
      save_method = form.findField('save_method');
      if (this.collageStore.count() > 0 && !this.collageStore.first().get('read_only')) {
        bla = this.collageStore.first().get('read_only');
        save_method = form.findField('save_method');
        save_method.setValue({
          method: 'update'
        });
        form.findField('name').setValue(this.collageStore.first().get('name'));
        return form.findField('personal_category').setValue(this.collageStore.first().get('personal_category'));
      } else {
        save_method.setValue({
          method: 'create'
        });
        return save_method.setDisabled(true);
      }
    }
  });

}).call(this);
