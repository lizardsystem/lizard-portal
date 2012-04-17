{% load get_portal_template %}
{
    itemId: 'advies',
    title: 'Advies',
    xtype: 'portalpanel',
    breadcrumbs: [
      {
          name: 'watersysteemkaart',
          link: 'homepage'
      },
      {
          name: 'Geschikte maatregelen'
      }
    ],
    items:[{
               width: 300,
               items: [
                  {% get_portal_template gebiedseigenschappen %},
                  {% get_portal_template esf-overzicht %}
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
                              var cm = Lizard.CM.getContext();

                              var url = '/measure/summary/'+ cm.object.id +'/suited_measures/';

                              me.loader.load({
                                  url:url,
                                  method: 'GET',
                                  callback: function() {
                                      me.setLoading(false);
                                  }
                              });
                           },
                          loader:{
                              renderer: 'html'
                          }
                      }]
	   }]
}

