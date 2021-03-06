//TODO: prevent initial load (saves one request)

Ext.define('Vss.grid.EsfHistory', {

    extend: 'Ext.tree.Panel',
    alias: 'widget.esf_grid_history',
    //TODO: prevent initial load (saves one request)




    value_renderer: function(value, metaData, record) {
       /*
        config_type: main_esf/expert_result/result/expert_setting/base_setting/folder
        type: oordeel/number/text

        manual_value
        auto_value

        add manual_text_value
        add auto_text_value

        manual/ is_manual ???
        validated??


        {name: 'id', mapping: 'id', type: 'auto'},
        {name: 'config_id', type: 'auto'},
        {name: 'name', type: 'string'},
        {name: 'source_name', type: 'auto'},
        {name: 'manual', type: 'int'},
        {name: 'is_manual', type: 'boolean'},
        {name: 'comment', type: 'string'},
        {name: 'last_edit_by', type: 'string'},
        {name: 'last_edit_date', type: 'string'},
        {name: 'iconCls', type: 'string'}


        */

       //function for formating 1 value
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
       } else if (record.data.config_type == 'base_setting') {
           return format(value, record)
       } else if  (record.data.config_type == 'map') {
           return ''
       } else { //rekenresultaat
           return format(record.data.auto_value, record)
       }
    },

    manual_renderer: function(value, metaData, record) {

       var cssPrefix = Ext.baseCSSPrefix;
       var classes = [cssPrefix + 'grid-checkheader'];

       var manual_class = 'grid-checkheader-hand';
       var auto_class = 'grid-checkheader-setting';
       var not_in_use = false;

       if (record.data.config_type == 'main_esf') {
           manual_class = 'grid-checkheader-hand';
           auto_class = 'grid-checkheader-setting-blue';

       } else if (record.data.config_type == 'expert_result') {
           manual_class = 'grid-checkheader-hand-gray';
           auto_class = 'grid-checkheader-setting-gray';

       } else if (record.data.config_type == 'result') {
           not_in_use = true;
       } else if (record.data.config_type == 'expert_setting') {
           manual_class = 'grid-checkheader-hand-gray';
           auto_class = 'grid-checkheader-setting-gray';
       } else if (record.data.config_type == 'base_setting') {
           not_in_use = true;
       } else if (record.data.config_type == 'folder') {
           not_in_use = true;
       } else {
           not_in_use = true;
       }

       if (not_in_use) {
           cls = 'grid-checkheader-null';
       } else if (record.data.config_type == 'main_esf' && value < 0.9 && (record.data.auto_value == null || record.data.auto_value < 0.9)) {
           cls = 'grid-checkheader-unhand';
       } else {
           if (value==1) {
               cls = manual_class;
           } else if (value==0) {
               cls = auto_class;
           }
           else {
               cls = 'grid-checkheader-null';
           }
       }
       classes.push(cssPrefix + cls);
       return '<div class="' + classes.join(' ') + '">&#160;</div>';
    },
    get_choice_renderer: function () {

    },
   initComponent: function(arguments) {
       var me = this;
       var manual_editor = function() { return false; }
       var value_editor = function() { return false; }

      Ext.apply(this, {
           collapsible: false,
           useArrows: true,
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
               text: 'Keuze',
               width: 40,
               dataIndex: 'manual',
               renderer: this.manual_renderer,
               getEditor: manual_editor,
               sortable: true
           },{
               text: 'Waarde',
               width: 60,
               dataIndex: 'manual_value',
               sortable: true,
               getEditor: value_editor,
               renderer: this.value_renderer,
               listeners: {
                   'mouseover': function(grid, component, row, col){
                       record = grid.store.getAt(row);
                       var html = ''
                       if (record.data.manual || ['base_setting'].indexOf(record.data.config_type) >= 0) {
                           html = record.get('comment') + '<br><i>' + record.get('last_edit_by') + ', ' + record.get('last_edit_date') + '</i>';
                       } else if (['result', 'expert_result', 'main_esf'].indexOf(record.data.config_type) >= 0 && record.get('auto_value_ts')) {
                           html =  'automatische waarde van ' + record.get('auto_value_ts');
                       }

                       //alert(record.get('name'))
                       Ext.create('Ext.tip.ToolTip', {
                           title: record.get('name'),
                           html: html,
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
      this.callParent(arguments);


   }


});



