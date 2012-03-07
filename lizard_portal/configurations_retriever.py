#!/usr/bin/python
# -*- coding: utf-8 -*-

# pylint: disable=C0111

# Copyright (c) 2012 Nelen & Schuurmans.  GPL licensed, see LICENSE.rst.

from mock import Mock


class ConfigurationsRetriever(object):

    def retrieve_as_list(self):
        configurations = self.retrieve_configurations()
        l = []
        for configuration in configurations:
            l.append(configuration.as_dict())
        return l

    def retrieve_configurations(self):
        pass


class MockConfig(object):

    def __init__(self, as_dict):
        self.as_dict = Mock(return_value=as_dict)
