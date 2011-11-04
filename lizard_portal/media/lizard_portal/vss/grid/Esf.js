Ext.override(Ext.data.AbstractStore,{
    indexOf: Ext.emptyFn
});

Ext.define('Vss.grid.Esf', {

    extend: 'Ext.tree.Panel',
    alias: 'widget.esf_grid',

    plugins: [
         Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 2}),
        'applycontext'
    ],
    selType: 'cellmodel',

    config: {
        
    },
    viewConfig:{
        toggleOnDblClick:false
    },

    applyParams: function(params) {
        var params = params|| {};
        console.log('apply params');
        console.log(params);

        if (this.store) {
            this.store.applyParams({object_id: params.object_id});
        }
    },

    constructor: function(config) {
        this.initConfig(config);
        Vss.grid.Esf.superclass.constructor.apply(this);
    },

    initComponent: function(arguments) {
        var me = this;

        var oordeel_editor =  Ext.create('Ext.grid.CellEditor', {
            field: Ext.create('Ext.form.field.ComboBox', {
                editable: false,
                store: [[ 1, 'OK' ], [0, 'Kritisch' ]]
            })
        });

        var value_renderer = function(value, metaData, record) {
            console.log(record)

            if (record.data.manual < 1) {
                value = record.data.auto_value;
            }

            if (record.data.type == 'oordeel') {
                if (value > 0.1) {
                    return '<span style="color:green;">OK</span>';
                } else {
                    return '<span style="color:red;">Kritisch</span>';
                }
            } else if (value < -998){
                return '-'
            } else {
                return value;
            }
        }

        Ext.apply(this, {
            id: 'rrrr',
            frame: false,
            border:false,
            collapsible: false,
            useArrows: true,
            store: Ext.create("Vss.store.Esf"),
            rootVisible: false,
            multiSelect: true,

            columns: [{
                xtype: 'treecolumn',
                text: 'Onderdeel',
                width:250,
                sortable: true,
                dataIndex: 'name'
            },{
                text: 'Bron',
                flex: 1,
                dataIndex: 'source_name',
                sortable: true
            },{
                text: 'Auto. waarde',
                flex: 1,
                dataIndex: 'auto_value',
                sortable: true,
                renderer: value_renderer
            },{
                text: 'Handmatig',
                flex: 1,
                dataIndex: 'manual',
                xtype: 'checkcolumntree',
                sortable: true,
                field: {
                    xtype: 'combobox',
                    editable: false,
                    width: 150,
                    store: [
                        [0,'auto'],
                        [1,'hand']
                    ],
                    lazyRender: true,
                    listClass: 'x-combo-list-small'
                }
            },{
                text: 'Waarde',
                flex: 1,
                dataIndex: 'manual_value',
                sortable: true,
                field: {
                    xtype: 'numberfield',
                    allowBlank: false
                },
                getEditor: function(record, default_editor) {
                    console.log(record);
                    if (record.data.type == 'oordeel') {
                        return oordeel_editor;
                    } else {
                        return default_editor;
                    }
                },
                renderer: value_renderer,
                listeners: {
                    'mouseover': function(a,b,c,d){
                        console.log(a);
                        console.log(b);
                        console.log(c);
                        console.log(d);
                    }
                }
            }],
            bbar: [{
                xtype: 'button',
                text: 'Cancel',
                iconCls: 'cancel',
                handler: function(menuItem, checked) {
                   me.store.rejectChanges();
                }
            },{
                xtype: 'button',
                id: 'save_button',
                text: 'Save',
                iconCls: 'save',
                handler: function(menuItem) {

                    Ext.MessageBox.show({
                        title: 'Wijzigingen opslaan',
                        msg: 'Opmerking',
                        width: 300,
                        multiline: true,
                        buttons: Ext.MessageBox.OKCANCEL,
                        fn: function (btn, text) {
                             if (btn=='ok') {
                                 me.store.sync();
                             }
                        }

                    });
                 }
            }]
        });

        this.callParent(arguments);


    }


});


