Ext.define 'Lizard.portlet.SwitcherPortlet',

    extend: 'Ext.panel.Panel'
    alias: 'widget.switcherportlet'
    height: 300
    
    requires: []

    initComponent: ->
        @text = "hahaha"
        
        Ext.apply @, {
            layout: 'fit',
            width: 600,
            height: @height,
            html: "This should be dynamically loaded!!"
            # html: Ext.Ajax.request
                # url: 'http://33.33.33.10/'
        }
        @callParent arguments