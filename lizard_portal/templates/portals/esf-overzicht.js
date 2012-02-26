{
			title: 'ESF-overzicht',
            height: 200,
            collapsed: false,
            collapsible: true,
            autoScroll: true,
            table_size:'small',
            plugins: [
                'applycontext'
            ],

            loader: {
                ajaxOptions: {
                    method: 'GET'
                },
                loadMask: true,
                renderer: 'html'
            },
            applyParams: function(params) {
                var me = this;
                me.url = '/esf/esf_overview/'+params.object.id+'/'
                me.getLoader().load({
                    url: me.url,
                    params: {
                        size: me.table_size
                    }
                });
            },
            tools: [{
                type: 'maximize',
                handler: function(e, target, panelHeader, tool){
                    var portal_col = panelHeader.up('portalcolumn')
                    var panel = panelHeader.up('portlet')
                    if (tool.type == 'maximize') {
                        tool.setType('minimize');
                        portal_col.original_width = portal_col.width
                        portal_col.setWidth(530);
                        panel.setHeight(430);
                        panel.table_size = 'large';


                    } else {
                        tool.setType('maximize');
                        portal_col.setWidth(portal_col.original_width);
                        panel.setHeight(200);
                        panel.table_size = 'small';
                    }
                    panel.getLoader().load({
                        url: panel.url,
                        params: {
                            size: panel.table_size
                        }
                    });
                }
            }]
		}
