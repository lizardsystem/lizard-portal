/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
Ext.define('Lizard.Portlet.GridPortlet', {

    extend: 'Ext.grid.Panel',
    alias: 'widget.gridportlet',
    height: 300,
    myData: [
        ['Polder A',         29.01, 0.42,  1.47,  '9/1 12:00am'],
        ['Polder B',         83.81, 0.28,  0.34,  '9/1 12:00am'],
        ['Polder C',         52.55, 0.01,  0.02,  '9/1 12:00am'],
        ['Polder D',         64.13, 0.31,  0.49,  '9/1 12:00am'],
        ['Polder X',         31.61, -0.48, -1.54, '9/1 12:00am'],
        ['Polder X',         75.43, 0.53,  0.71,  '9/1 12:00am'],
        ['Polder X',         67.27, 0.92,  1.39,  '9/1 12:00am'],
        ['Polder X',         49.37, 0.02,  0.04,  '9/1 12:00am'],
        ['Polder X',         40.48, 0.51,  1.28,  '9/1 12:00am'],
        ['Polder X',         68.1,  -0.43, -0.64, '9/1 12:00am'],
        ['Polder X',         34.14, -0.08, -0.23, '9/1 12:00am'],
        ['Polder X',         30.27, 1.09,  3.74,  '9/1 12:00am'],
        ['Polder X',         36.53, -0.03, -0.08, '9/1 12:00am'],
        ['Polder X',         38.77, 0.05,  0.13,  '9/1 12:00am'],
        ['Polder X',         19.88, 0.31,  1.58,  '9/1 12:00am'],
        ['Polder X',         81.41, 0.44,  0.54,  '9/1 12:00am'],
        ['Polder X',         64.72, 0.06,  0.09,  '9/1 12:00am'],
        ['Polder X',         45.73, 0.07,  0.15,  '9/1 12:00am'],
        ['Polder X',         36.76, 0.86,  2.40,  '9/1 12:00am'],
        ['Polder X',         40.96, 0.41,  1.01,  '9/1 12:00am'],
        ['Polder X',         25.84, 0.14,  0.54,  '9/1 12:00am'],
        ['Polder X',         27.96, 0.4,   1.45,  '9/1 12:00am'],
        ['Polder X',         45.07, 0.26,  0.58,  '9/1 12:00am'],
        ['Polder X',         34.64, 0.35,  1.02,  '9/1 12:00am'],
        ['Polder X',         61.91, 0.01,  0.02,  '9/1 12:00am'],
        ['Polder X',         63.26, 0.55,  0.88,  '9/1 12:00am'],
        ['Polder X',         35.57, 0.39,  1.11,  '9/1 12:00am'],
        ['Polder X',         45.45, 0.73,  1.63,  '9/1 12:00am']
    ],

    /**
     * Custom function used for column renderer
     * @param {Object} val
     */
    change: function(val) {
        if (val < 35) {
            return '<span style="color:green;">' + val + '</span>';
        } else if (val > 80) {
            return '<span style="color:red;">' + val + '</span>';
        }
        return val;
    },

    /**
     * Custom function used for column renderer
     * @param {Object} val
     */
    pctChange: function(val) {
        if (val < 0.2 && val > -0.2) {
            return '<span style="color:green;">' + val + '</span>';
        } else {
            return '<span style="color:red;">' + val + '</span>';
        }
        return val;
    },

    initComponent: function(){

        var store = Ext.create('Ext.data.ArrayStore', {
            fields: [
               {name: 'company'},
               {name: 'change',     type: 'float'},
               {name: 'pctChange',  type: 'float'}
            ],
            data: this.myData
        });

        Ext.apply(this, {
            //height: 300,
            height: this.height,
            store: store,
            stripeRows: true,
            columnLines: true,
            columns: [{
                id       :'company',
                text   : 'Gebied',
                //width: 120,
                flex: 1,
                sortable : true,
                dataIndex: 'company'
            },{
                text   : 'Gemiddeld debiet',
                width    : 75,
                sortable : true,
                renderer : this.change,
                dataIndex: 'change'
            },{
                text   : 'Max. Waterpeil',
                width    : 75,
                sortable : true,
                renderer : this.pctChange,
                dataIndex: 'pctChange'
            }]
        });

        this.callParent(arguments);
    }
});

