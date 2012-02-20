(function() {
  Ext.define('Lizard.portlet.SwitcherPortlet', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.switcherportlet',
    height: 300,
    requires: [],
    initComponent: function() {
      this.text = "hahaha";
      Ext.apply(this, {
        layout: 'fit',
        width: 600,
        height: this.height,
        html: "This should be dynamically loaded!!"
      });
      return this.callParent(arguments);
    }
  });
}).call(this);
