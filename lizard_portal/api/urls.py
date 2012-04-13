#!/usr/bin/python
# -*- coding: utf-8 -*-

# pylint: disable=C0111

# Copyright (c) 2012 Nelen & Schuurmans.  GPL licensed, see LICENSE.rst.

from django.conf.urls.defaults import patterns
from django.conf.urls.defaults import url
from django.contrib import admin

from lizard_portal.api.views import ConfigurationToValidateView

admin.autodiscover()

NAME_PREFIX = 'lizard_portal_api_'

urlpatterns = patterns(
    '',
    url(r'^configuration/$',
        ConfigurationToValidateView.as_view(),
        name=NAME_PREFIX + 'configuration'),
    )
