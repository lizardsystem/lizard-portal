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
    url(r'^example_treedata.json$', 
        direct_to_template,
        {'template': 'example_treedata.json', 'mimetype': 'application/json'},
        name="example-treedata"),    

    )
urlpatterns += debugmode_urlpatterns()
