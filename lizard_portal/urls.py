# (c) Nelen & Schuurmans.  GPL licensed, see LICENSE.txt.
from django.conf.urls.defaults import include
from django.conf.urls.defaults import patterns
from django.conf.urls.defaults import url
from django.contrib import admin
from django.views.generic.simple import direct_to_template
from django.views.generic.simple import redirect_to

from lizard_ui.urls import debugmode_urlpatterns

admin.autodiscover()

urlpatterns = patterns(
    '',
    (r'^admin/', include(admin.site.urls)),
    url(r'^$',
        redirect_to,
        {'url': 'watersysteem/'},
        name="portalpage"),


    url(r'^site/(?P<application_name>.*)/(?P<active_tab_name>.*)/$',
        'lizard_portal.views.site',
        name="site"),
    url(r'^application/(?P<application_name>.*)/(?P<active_tab_name>.*)/$',
         'lizard_portal.views.application',
        name="application"),


    url(r'^configuration/',
        'lizard_portal.views.json_configuration',
        name="json_configuration"),
    url(r'^example_portal.json',
        direct_to_template,
        {'template': 'example_portal1.json'},
        name='portal'),

    url(r'^bucket_grid_config.json',
        direct_to_template,
        {'template': 'bucket_grid_config.json'},
        name='portal'),

    url(r'^wbbuckets.json',
        direct_to_template,
        {'template': 'wbbuckets.json'},
        name='portal'),
    url(r'^wbgebied.json',
        direct_to_template,
        {'template': 'wbgebied.json'},
        name='portal'),
    url(r'^wbopenwater.json',
        direct_to_template,
        {'template': 'wbopenwater.json'},
        name='portal'),
    url(r'^wbstructures.json',
        direct_to_template,
        {'template': 'wbstructures.json'},
        name='portal'),

    url(r'^analyse_interpretatie.json',
        direct_to_template,
        {'template': 'analyse_interpretatie.json'},
        name='analyse_interpretatie'),
    url(r'^example_treedata.json',
        direct_to_template,
        {'template': 'example_treedata.json'},
        name='treedata'),
    url(r'^getFeatureInfo',
        'lizard_portal.views.feature_info',
        name='feature_info'),
    )
urlpatterns += debugmode_urlpatterns()
