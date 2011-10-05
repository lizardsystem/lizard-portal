/**
 * Created by JetBrains WebStorm.
 * User: bastiaan.roos
 * Date: 24-7-11
 * Time: 23:00
 * To change this template use File | Settings | File Templates.
 */


Ext.define('Lizard.container.MapPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.map-panel',
    uses:[
        'Lizard.map.NavigationToolbar',
        'Lizard.map.SelectionToolbar',
        'Lizard.map.MapToolsToolbar',
        'Lizard.app.remarks.RemarkToolbar'
    ],
    //cls: 'x-portal',
    //bodyCls: 'x-portal-body',

    initComponent : function() {
        Ext.apply(this, {
            tbar: this.getToolbarGroups(),
            items: [{
                xtype:'tabpanel',
                tabPosition: 'bottom',
                height:'100%',

                items:[{
                    title: 'Map',
                    html:'KAART met: laag A<br>laag B<br>laag C<br>laag D<br>laag E<br>laag F'
                },{
                    title:'Collage X'
                }]
            }]
        });
        this.callParent();
    },
    getToolbarGroups: function() {
        toolbar = [];
        toolbar.push(new Lizard.map.NavigationToolbar());
        toolbar.push(new Lizard.map.SelectionToolbar());
        toolbar.push(new Lizard.map.MapToolsToolbar());
        toolbar.push('-');
        toolbar.push(new Lizard.app.remarks.RemarkToolbar());
        toolbar.push('->')

        menu_items = []
        for (var i=0; i<toolbar.length; i++) {
            var tb = toolbar[i];
            if (typeof(tb.title) != 'undefined') {
                menu_items.push(
                   {
                       text: tb.title || "",
                       referenceToolbarGroup: tb,
                       handler: function(btn, event) {
                           if (btn.checked === true) {
                               btn.referenceToolbarGroup.show();
                           } else {
                               btn.referenceToolbarGroup.hide();
                           }
                       },
                       checked: true
                    }
                );
            }
        }

        toolbar.push({
            text: 'Toolbars',
            iconCls: 'icon_dummy',
            menu: menu_items
        });
        return toolbar;
    }
});