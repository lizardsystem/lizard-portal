/**
 * Created by JetBrains WebStorm.
 * User: bastiaan.roos
 * Date: 23-7-11
 * Time: 22:40
 * To change this template use File | Settings | File Templates.
 */

Ext.define('Lizard.container.Header', {
    extend: 'Ext.container.Container',
    alias: 'widget.site-header',
    //cls: 'x-portal',
    //bodyCls: 'x-portal-body',

    initComponent : function() {
        var this_ref = this;
        var createLink = function (id, content, on_item_click) {

            this_ref.on('afterRender', function(eventObj, elRef) {
                Ext.get(id).on('click', on_item_click);
            });
            //TODO: on destroy

            return '<div id="' + id + '"><a href="#">' + content + '</a></div>';
        }


        Ext.apply(this, {
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
                frame: false,
                border:false
            },
            items: [{
                xtype:'container',
                html: createLink('logo', '<img src="media/lizard_ui/logo.png" />', this.onLinkClick),
                cls:'header-logo',//deze doet niks(???), daarom ook nog een keer in de html
                width:150
            },{
                //empty space
                xtype:'container',
                flex:1
            },{
                xtype: 'panel',
                html: createLink('indices_link', 'Indices<br><img src="media/lizard_ui/location-light.png" class="header-tab-logo"/>', this.onLinkClick),
                bodyCls:'header-tab',
                width:75,
                margin: '0 0 0 5'
            },{
                xtype: 'panel',
                html:createLink('viewer_link', 'Viewer<br><img src="media/lizard_ui/location-light.png" class="header-tab-logo"/>', this.onLinkClick),
                bodyCls:'header-tab',
                width:75,
                margin: '0 0 0 5'
            },{
                xtype: 'panel',
                html:createLink('toolbox_link', 'Toolbox<br><img src="media/lizard_ui/location-light.png" class="header-tab-logo"/>', this.onLinkClick),
                bodyCls:'header-tab',
                width:75,
                margin: '0 0 0 5'
            },{
                xtype: 'panel',
                html:createLink('report_link', 'Rapportage<br><img src="media/lizard_ui/location-light.png" class="header-tab-logo"/>', this.onLinkClick),
                bodyCls:'header-tab',
                width:75,
                margin: '0 0 0 5'
            },{
                //empty space and login
                id:'loginPanel',
                xtype:'box',
                html:'<div class="header-loginPanel"> Bastiaan Roos | <img src="media/lizard_ui/location-light.png" class="header-loginPanel-settingIcon"/></img></div>',
                itemCls:'header-loginPanel',//deze doet niks(???), daarom ook nog een keer in de html
                flex:1
            }]
        });

        this.callParent();



    },
    onLinkClick: function(eventRef, objRef) {
        //TODO
        alert('to ' + objRef.id);
    }
})
