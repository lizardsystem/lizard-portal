
Ext.define('Lizard.form.FormAutoload', {
  extend: 'Ext.form.Panel',
  alias: 'widget.formautoload',
  config: {
    loadProxy: null
  },
  constructor: function() {
    this.initConfig(arguments);
    return this.callParent(arguments);
  },
  initComponent: function() {
    var me;
    me = this;
    return this.callParent(arguments);
  },
  afterRender: function() {
    this.callParent(arguments);
    if (this.getLoadProxy()) return this.load(this.getLoadProxy());
  }
});
