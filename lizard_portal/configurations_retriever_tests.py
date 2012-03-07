#!/usr/bin/python
# -*- coding: utf-8 -*-

# pylint: disable=C0111

# Copyright (c) 2012 Nelen & Schuurmans.  GPL licensed, see LICENSE.rst.

from unittest import TestCase

from mock import Mock

from lizard_portal.configurations_retriever import ConfigurationFactory
from lizard_portal.configurations_retriever import ConfigurationsRetriever
from lizard_portal.configurations_retriever import MockConfig


class ConfigurationsRetrieverTestSuite(TestCase):

    def create_retriever(self):
        return ConfigurationsRetriever(ConfigurationFactory(StubDescriptionParser()))

    def test_a(self):
        """Test the right configurations are retrieved."""
        retriever = self.create_retriever()
        configuration_list = ['config A', 'config B']
        retriever.retrieve_configurations = \
            (lambda : [MockConfig(config) for config in configuration_list])
        self.assertEqual(configuration_list, retriever.retrieve_as_list())

    def test_b(self):
        """Test no configurations are retrieved when there are no zip files."""
        retriever = self.create_retriever()
        retriever.retrieve_zip_files = (lambda : [])
        self.assertEqual([], retriever.retrieve_as_list())

    def test_c(self):
        """Test a single configurations is retrieved when there is a single zip file."""
        retriever = self.create_retriever()
        retriever.retrieve_zip_files = (lambda : ['waterbalans_Waternet_20120228_141234.zip'])
        configurations = retriever.retrieve_configurations()
        self.assertEqual(1, len(configurations))
        self.assertEqual('waterbalans_Waternet_20120228_141234.zip', configurations[0].zip_file)


class StubDescriptionParser(object):

    def as_dict(self, description_file):
        return {'name': 'Pieter Swinkels'}


class ConfigurationFactoryTestSuite(TestCase):

    def test_a(self):
        factory = ConfigurationFactory(StubDescriptionParser())
        factory.get_description_file = (lambda s:'an open file')
        configuration = factory.create('mnt/vss-share/waterbalans_Waternet_20120228_141234.zip')
        self.assertEqual(configuration.zip_file, 'mnt/vss-share/waterbalans_Waternet_20120228_141234.zip')
        self.assertEqual(configuration.name, 'Pieter Swinkels')


