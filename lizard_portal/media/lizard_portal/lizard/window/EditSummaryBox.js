(function() {
  Ext.define('Lizard.window.EditSummaryBox', {
    statics: {
      show: function(config) {
        var a, args;
        a = Ext.create('Ext.window.MessageBox', {
          btnCallback: function(btn) {
            var field, msgBox, value;
            if (btn === 'ok') {
              msgBox = this;
              field = msgBox.textArea;
              value = field.getValue();
              if (value < 1) {
                field.setActiveError('Minimale lengte is 1 letter');
                return false;
              }
              btn.blur();
              if (msgBox.userCallback(btn.itemId, value, field)) {
                msgBox.hide();
                return msgBox.destroy();
              }
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
