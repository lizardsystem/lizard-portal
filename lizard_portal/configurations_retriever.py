#!/usr/bin/python
# -*- coding: utf-8 -*-

# pylint: disable=C0111

# Copyright (c) 2012 Nelen & Schuurmans.  GPL licensed, see LICENSE.rst.

from mock import Mock


class ConfigurationsRetriever(object):

    def __init__(self, configuration_factory):
        self.configuration_factory = configuration_factory

    def retrieve_as_list(self):
        configurations = self.retrieve_configurations()
        l = []
        for configuration in configurations:
            l.append(configuration.as_dict())
        return l

    def retrieve_configurations(self):
        configurations = []
        for zip_file in self.retrieve_zip_files():
            configuration = self.configuration_factory.create(zip_file)
            configurations.append(configuration)
        return configurations


class ConfigurationFactory(object):

    def __init__(self, description_parser):
        self.parser = description_parser

    def create(self, zip_file):
        configuration = Mock()
        configuration.zip_file = zip_file
        description_file = self.get_description_file(zip_file)
        description_dict = self.parser.as_dict(description_file)
        for key, value in description_dict.items():
            setattr(configuration, key, value)
        return configuration

    def get_description_file(self, zip_file):
        pass

class MockConfig(object):

    def __init__(self, as_dict):
        self.as_dict = Mock(return_value=as_dict)
