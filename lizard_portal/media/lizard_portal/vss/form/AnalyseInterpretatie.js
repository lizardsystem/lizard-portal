


Ext.create('Ext.form.Panel',{
    id: 'analyse_form',
    fields:[{

    },{

    }]

});


                        {title:'Eco'}
                        {
                            title:'WQ',
                            id: 'analyse_form',
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            #xtype:'form',
                            autoScroll: true,
                            bbar:['save']


                            items:[

                                {
                                    fieldLabel: 'titel'
                                    xtype: 'textfield'
                                }
                                {
                                    fieldLabel: 'label'
                                    store: [1,2,3,4,5,6,7,8,9,10]
                                    xtype: 'combo'
                                    multiSelect: true
                                    forceSelection: true
                                }
                                {
                                    fieldLabel: 'label'
                                    store: {
                                        fields: [
                                            {
                                                name: 'id',

                                            },{
                                                name: 'text',

                                            }
                                        ]
                                    }
                                    xtype: 'gridpanel'
                                    columns: [{
                                        text: 'Gebieden',
                                        dataIndex: 'text'
                                        flex:1
                                    }]
                                    height: 100,
                                    viewConfig: {
                                        plugins: {
                                            ptype: 'gridviewdragdrop',
                                            dropGroup: 'firstGridDDGroup'
                                        }
                                    }

                                }
                                {
                                    title:'text',
                                    xtype: 'htmleditor'
                                    height: 200
                                    #resizable: true
                                }
                            ]
                        }