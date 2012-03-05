(function() {

  Ext.define('Lizard.portlet.AppScreenPortlet', {
    extend: 'Lizard.portlet.Portlet',
    alias: 'widget.appscreenportlet',
    layout: {
      type: 'vboxscroll',
      align: 'stretch'
    },
    defaults: {
      flex: 1,
      height: 250
    },
    autoScroll: true,
    initComponent: function() {
      Ext.apply(this, {
        items: {
          xtype: 'dataview',
          store: this.store,
          tpl: new Ext.XTemplate('<tpl for=".">', '<div class="app_icon draggable"><a href="{url}" title="{description}">', '<img src="/static_media/lizard_portal/app_icons/metingen.png" ', 'id="app-{slug}" />', '<div>{name} ({type})</div>', '</a></div>', '</tpl>'),
          itemSelector: 'div.apps-source',
          listeners: {
            render: function(v) {
              return v.dragZone = Ext.create('Ext.dd.DragZone', v.getEl(), {
                getDragData: function(e) {
                  var d, sourceEl;
                  sourceEl = e.getTarget(v.itemSelector, 10);
                  if (sourceEl) {
                    d = sourceEl.cloneNode(true);
                    d.id = Ext.id();
                    return v.dragData = {
                      sourceEl: sourceEl,
                      repairXY: Ext.fly(sourceEl).getXY(),
                      ddel: d,
                      patientData: v.getRecord(sourceEl).data
                    };
                  }
                },
                getRepairXY: function() {
                  return this.dragData.repairXY;
                }
              });
            }
          }
        }
      });
      return this.callParent(arguments);
    }
  });

}).call(this);
