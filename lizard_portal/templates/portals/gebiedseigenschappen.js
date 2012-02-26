{
			title: 'Gebiedsinformatie',
            flex:1,
            plugins: [
                'applycontext'
            ],
            autoScroll: true,
            tpl: new Ext.XTemplate(
                '<p><table class="l-grid"> ',
                '<tpl for=".">',       // process the data.kids node
                '<tr class="l-row"><td>{name}<td>{value}</tr>',  // use current array index to autonumber
                '</tpl><table class="l-grid"></p>'
            ),
            loader: {
                ajaxOptions: {
                    method: 'GET'
                },
                loadMask: true,
                url: '/area/api/property/',
                autoLoad: false,
                 baseParams: {
                     _accept: 'application/json'
                 },
                renderer: 'data'
            },
            applyParams: function(params) {
                 var me = this;
                 me.getLoader().load({
                     params: {
                         object_id: params.object.id
                     }
                 });
            }

		}