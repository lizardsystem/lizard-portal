/**
 * Created by JetBrains WebStorm.
 * User: bastiaan.roos
 * Date: 22-7-11
 * Time: 22:04
 * To change this template use File | Settings | File Templates.
 */

Ext.define('Lizard.Window.Viewer', {
    /** @readonly */
    extend:'Ext.container.Viewport',

    uses: [
        'Lizard.container.Header',
        'Lizard.container.MapPanel'
    ],

    config: {
        spacial: true
    },
    initComponent: function(arguments) {
        Ext.apply(this, {
            layout: {
                type: 'border',
                padding: '0 5 5 5'
            },
            defaults: {
                collapsible: true,
                floatable: true,
                split: true,
                frame: true
            },
            items: [{
                region: 'north',
                collapsible: false,
                floatable: false,
                split: false,
                frame:false,
                border:false,
                height: 60,
                xtype:'site-header'
            },{
                region: 'west',
                title: 'Apps',
                width: 250,
                layout: {
                    type:'vbox',
                    align:'stretch'
                },
                defaults: {
                    scale: 'large',
                    iconAlign:'left'
                },
                tbar: [{
                    text:null,
                    icon:'media/lizard_ui/rainapp.png',
                    scale: 'large'
                },
                    '-'
                ,{
                    text:null,
                    icon:'media/lizard_ui/meetgegevens.png',
                    scale: 'medium'
                },{
                    text:null,
                    icon:'media/lizard_ui/turtle.png',
                    scale: 'medium'
                },{
                    text:null,
                    icon:'media/lizard_ui/meetgegevens.png',
                    scale: 'medium'
                },{
                    text:null,
                    icon:'media/lizard_ui/turtle.png',
                    scale: 'medium'
                },{
                    text:null,
                    icon:'media/lizard_ui/meetgegevens.png',
                    scale: 'medium'
                },{
                    text:null,
                    icon:'media/lizard_ui/turtle.png',
                    scale: 'medium'
                }],
                items:[{
                    title:'app navigatie',
                    flex:1
                },{
                    title:'links',
                    height:100,
                    html:'IR-EGV grafieken<br>Statistiek<br>'
                }]
            },{
                region: 'center',
                collapsible: false,
                floatable: false,
                split: false,
                border: false,
                frame:false,
                xtype:'map-panel'
            },{
                region: 'east',
                width: 200,
                title: 'mijn verzamelingen',
                frame:false,
                layout:{
                    type: 'vbox',
                    align:'stretch'
                },
                items:[{
                    frame:false,
                    flex:1,
                    layout:{
                        type: 'accordion'
                    },
                    items :[{
                        title:'workspaces',
                        tbar:[{
                            text:'save'
                        },{
                            text:'load'
                        }],
                        items: [{
                            xtype:'tabpanel',
                            items:[{
                                title: 'my selection',
                                html:'laag A<br>laag B<br>laag C<br>laag D<br>laag E<br>laag F'
                            },{
                                title:'KRW doelen'
                            }]
                        }]
                    },{
                        title:'collages',
                        tbar:[{
                            text:'save'
                        },{
                            text:'load'
                        }],
                        items: [{
                            xtype:'tabpanel',
                            items:[{
                                title: 'my selection',
                                html:'punt A<br>punt B<br>punt C<br>punt D<br>punt E<br>punt F'
                            },{
                                title:'KRW meetpunten'
                            }]
                        }]
                    },{
                        title:'bookmarks'
                    }]
                },{
                    title:'omgevings variabelen',
                    height:100,
                    html:'gebied: Polder X<br>periode: Y<br>context: Waterkwaliteit-specialist'
                }]
            },{
                region: 'south',
                collapsed: true,
                height: 200,
                title: 'beheer',
                html: 'beheer/ instel/ ontwikkelschermen'
            }]
        });

        /**/

        //this.initConfig(config);
        //this.callParent();
        Lizard.Window.Viewer.superclass.initComponent.apply(this, arguments);

        return this;
    }
});