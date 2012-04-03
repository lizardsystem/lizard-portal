//TODO: prevent initial load (saves one request)

Ext.define('Vss.grid.Esf', {

    extend: 'Ext.tree.Panel',
    alias: 'widget.esf_grid',

    plugins: [
         Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 2}),
        'applycontext'
    ],
    selType: 'cellmodel',

    config: {
        editable: true,
        autoLoad: false
    },
    tools: [{
        type: 'right',
        handler: function (e, target, panelHeader, tool) {
            var portal_col = panelHeader.up('portalcolumn')
            if (tool.type == 'left') {
                tool.setType('right');
                portal_col.setWidth(360);
            } else {
                tool.setType('left');
                portal_col.setWidth(700);

            }

        }

    }],
    applyParams: function(params) {
        var params = params|| {};
        console.log('apply params');
        console.log(params);

        if (this.store) {

            this.store.applyParams({object_id: params.object.id});
        }
    },

    constructor: function(config) {
        this.initConfig(arguments);
        this.callParent(arguments);
    },

    initComponent: function(arguments) {
        var me = this;

        var oordeel_editor =  Ext.create('Ext.grid.CellEditor', {
            field: Ext.create('Ext.form.field.ComboBox', {
                editable: false,
                store: [[ 2, 'OK' ], [1, 'Kritisch' ]]
            })
        });
        var number_editor = Ext.create('Ext.grid.CellEditor', {
             field: {
                xtype: 'numberfield',
                allowBlank: false
            }
        });

        var value_renderer = function(value, metaData, record) {
            console.log(record)
            var format = function(value, record) {
                if (record.data.type == 'oordeel') {
                    if (value == null){
                        return '-'
                    } else if (value < 0.1) {
                        return '-'
                    }
                    else if (value < 1.1) {
                        return '<span style="color:red;">Kritisch</span>';
                    } else {
                        return '<span style="color:green;">OK</span>';
                    }
                } else if (value == null){
                    return '-'
                } else {
                    return value;
                }
            }
            if (record.data.manual > 0.1 && record.data.is_manual) {
                return format(value, record) + ' (' + format(record.data.auto_value, record) + ')'
            } else if (record.data.config_type == 'parameter') {
                return format(value, record)
            } else { //rekenresultaat
                return format(record.data.auto_value, record)
            }
        }

        if (this.editable) {

            var manual_editor = function(record) {
                if (record.data.is_manual) {

                    return {
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
                } else {
                    return false;
                }
            }

            var value_editor = function(record) {

                if ((record.data.is_manual && record.data.manual == 1) || (record.data.config_type == 'parameter')) {
                    if (record.data.type == 'oordeel') {
                        return oordeel_editor;
                    } else {
                        return number_editor;
                    }
                } else {
                    return false;
                }
            }
        } else {
            var manual_editor = function() { return false; }
            var value_editor = function() { return false; }


        }

        var manual_renderer = function(value, metaData, record) {

            var cssPrefix = Ext.baseCSSPrefix;
            var cls = [cssPrefix + 'grid-checkheader'];
            if (record.data.config_type == 'parameter') {
                cls.push(cssPrefix + 'grid-checkheader-setting');
                return '<div class="' + cls.join(' ') + '">&#160;</div>';
            } else if (record.data.is_manual) {
                if (value==1) {
                    cls.push(cssPrefix + 'grid-checkheader-hand');
                } else if (value==0) {
                    cls.push(cssPrefix + 'grid-checkheader-unhand');
                }
                else {
                    cls.push(cssPrefix + 'grid-checkheader-null');
                }
                return '<div class="' + cls.join(' ') + '">&#160;</div>';
            }
        }

        Ext.apply(this, {
            collapsible: false,
            useArrows: true,
            store: Ext.create("Vss.store.Esf"),
            rootVisible: false,
            multiSelect: true,
            viewConfig: {
                trackOver: true,
                toggleOnDblClick:false
            },
            columns: [{
                xtype: 'treecolumn',
                text: 'Onderdeel',
                width:250,
                sortable: true,
                dataIndex: 'name'
            },{
                text: 'Handm.',
                width: 40,
                dataIndex: 'manual',
                renderer: manual_renderer,
                getEditor: manual_editor,
                sortable: true
            },{
                text: 'Waarde',
                width: 60,
                dataIndex: 'manual_value',
                sortable: true,
                getEditor: value_editor,
                renderer: value_renderer,
                listeners: {
                      'mouseover': function(grid, component, row, col){
                          console.log(arguments);
                          record = grid.store.getAt(row);
                          //alert(record.get('name'))
                          Ext.create('Ext.tip.ToolTip', {
                              title: record.get('name'),
                              html: record.get('comment') + '<br><i>' + record.get('last_edit_by') + ', ' + record.get('last_edit_date') + '</i>',
                              anchor: 'left',
                              width: 300,
                              target: component
                          }).show()
                      }
                }
            },{
                text: 'Bron auto',
                width: 70,
                dataIndex: 'source_name'
            },{
                text: 'Omschrijving',
                flex: 1,
                dataIndex: 'comment',
                editor: 'textfield',
                sortable: true
            }]
        });

        if (this.editable) {
            Ext.apply(this, {
                bbar: [{
                    xtype: 'button',
                    text: 'Reset',
                    iconCls: 'l-icon-cancel',
                    handler: function(menuItem, checked) {
                        me.store.rejectChanges();
                    }
                },{
                    xtype: 'button',
                    id: 'save_button',
                    text: 'Save',
                    iconCls: 'l-icon-disk',
                    handler: function(menuItem) {

                        me.store.sync();
                    }
                }]
            });
        }

        this.callParent(arguments);


    }


});


