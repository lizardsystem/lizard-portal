(function() {

  Ext.define('Lizard.window.EditSummaryBox', {
    statics: {
      show: function(config) {
        var a, args;
        a = Ext.create('Ext.window.MessageBox', {
          btnCallback: function(btn) {
            var field, value;
            if (btn.itemId === 'ok') {
              field = this.textArea;
              value = field.getValue();
              if (value < 1) {
                field.setActiveError('Minimale lengte is 1 letter');
                return false;
              }
              btn.blur();
              if (this.userCallback(btn.itemId, value, field)) {
                this.hide();
                return this.destroy();
              }
            } else {
              this.hide();
              return this.destroy();
            }
          }
        });
        args = Ext.merge({
          title: 'Wijzigingen opslaan',
          msg: 'Samenvatting',
          width: 300,
          multiline: true,
          buttons: Ext.MessageBox.OKCANCEL,
          fn: function(btn, text, field) {
            return true;
          }
        }, config);
        return a.show(args);
      }
    }
  });

}).call(this);
