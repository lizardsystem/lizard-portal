/**
 * Created by JetBrains WebStorm.
 * User: bastiaan.roos
 * Date: 25-7-11
 * Time: 11:50
 * To change this template use File | Settings | File Templates.
 */

Ext.define('Lizard.map.SelectionToolbar', {
    extend: 'Ext.container.ButtonGroup',
    alias: 'widget.map-selection-toolbar',
    initComponent : function() {
        Ext.apply(this, {
            title: 'Selectie',
            defaults: {
                scale: 'small',
                iconAlign:'left',
                arrowAlign:'right'
            },
            items: [{
                text: null,
                iconCls: 'icon_dummy'
            },{
                text: null,
                iconCls: 'icon_dummy'
            },{
                text: 'Copy'
            },{
                text: 'zoom naar',
                iconCls: 'icon_dummy',
                menu: [
                    {text: 'Werk gebied'},
                    {text: 'Selectie'},
                    {text: 'Workspace'},
                    {text: 'Beheersgebied'}
                ]
            }]
        });

        this.callParent();
    }
});

