# (c) Nelen & Schuurmans.  GPL licensed, see LICENSE.txt.
from django.conf.urls.defaults import include
from django.conf.urls.defaults import patterns
from django.conf.urls.defaults import url
from django.contrib import admin
from django.views.generic.simple import direct_to_template

from lizard_ui.urls import debugmode_urlpatterns

admin.autodiscover()

urlpatterns = patterns(
    '',
    (r'^admin/', include(admin.site.urls)),
    url(r'^$',
        direct_to_template,
        {'template': 'portal_pageframe.html'},
        name="portalpage"),
    url(r'^portalheader/',
        direct_to_template,
        {'template': 'header.html'},
        name="portalheader"),
        
    url(r'^configuration/',
        'lizard_portal.views.json_configuration',
        name="json_configuration"),
    url(r'^example_portal.json',
        direct_to_template,
        {'template': 'example_portal1.json'},
        name='portal'),
    url(r'^analyse_interpretatie.json',
        direct_to_template,
        {'template': 'analyse_interpretatie.json'},
        name='analyse_interpretatie'),
    url(r'^example_treedata.json',
        direct_to_template,
        {'template': 'example_treedata.json'},
        name='treedata'),
    )
urlpatterns += debugmode_urlpatterns()
