/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
Ext.define('Lizard.Portlet.ChartPortlet', {

    extend: 'Ext.panel.Panel',
    alias: 'widget.chartportlet',

    requires: [
        'Ext.data.JsonStore',
        'Ext.chart.theme.Base',
        'Ext.chart.series.Series',
        'Ext.chart.series.Line',
        'Ext.chart.axis.Numeric'
    ],

    generateData: function(){
        var data = [{
                name: 'x',
                Totaal_gemalen: 10000,
                RBP: -0.4
            }],
            i;
        for (i = 1; i < 50; i++) {
            data.push({
                name: 'x',
                RBP: data[i - 1].RBP + 0.01*((Math.floor(Math.random() * 2) % 2) ? -1 : 1) * Math.floor(Math.random() * 7),
                Totaal_gemalen: data[i - 1].Totaal_gemalen + 6*((Math.floor(Math.random() * 2) % 2) ? -1 : 1) * Math.floor(Math.random() * 7)
            });
        }
        return data;
    },

    initComponent: function(){

        Ext.apply(this, {
            layout: 'fit',
            width: 600,
            height: 300,
            items: {
                xtype: 'chart',
                animate: false,
                shadow: false,
                store: Ext.create('Ext.data.JsonStore', {
                    fields: ['name', 'RBP', 'Totaal_gemalen'],
                    data: this.generateData()
                }),
                legend: {
                    position: 'bottom'
                },
                axes: [{
                    type: 'Numeric',
                    position: 'left',
                    fields: ['Totaal_gemalen'],
                    title: 'Debiet',
                    label: {
                        font: '11px Arial'
                    }
                }, {
                    type: 'Numeric',
                    position: 'right',
                    grid: false,
                    fields: ['RBP'],
                    title: 'Waterstand',
                    label: {
                            font: '11px Arial'
                        }
                }],
                series: [{
                    type: 'line',
                    lineWidth: 1,
                    showMarkers: false,
                    fill: true,
                    axis: 'left',
                    xField: 'name',
                    yField: 'Totaal_gemalen',
                    style: {
                        'stroke-width': 1
                    }
                }, {
                    type: 'line',
                    lineWidth: 1,
                    showMarkers: false,
                    axis: 'right',
                    xField: 'name',
                    yField: 'RBP',
                    style: {
                        'stroke-width': 1
                    }
                }]
            }
        });

        this.callParent(arguments);
    }
});

