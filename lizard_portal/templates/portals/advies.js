{% load get_portal_template %}
{
    itemId: 'advies',
    title: 'Advies',
    xtype: 'portalpanel',
    items:[{
               width: 300,
               items: [
                  {% get_portal_template gebiedseigenschappen %},
                  {title: 'ESF scores',
                    flex:1}
               ]
           },{
               flex:1,
               items:[{
                          title: 'Maatregelen',
                          flex:1,
                          autoScroll: true,
                          plugins: [
                              'applycontext'
                          ],
                          applyParams: function(params) {
                              var me = this;
                              me.setLoading(true);
                              var cm = Ext.getCmp('portalWindow').context_manager.getContext();
                              var url = '/measure/summary/'+ cm.object.id +'/krw_measures/';
                              me.loader.load({
                                                 url:url,
                                                 method: 'GET'
                                             });
                              me.setLoading(false);
                          },
                          loader:{
                              renderer: 'html'
                          }
                      }]
	   }]
}

