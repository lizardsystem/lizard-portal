#!/usr/bin/python
# -*- coding: utf-8 -*-

# pylint: disable=C0111

# Copyright (c) 2012 Nelen & Schuurmans.  GPL licensed, see LICENSE.rst.

from unittest import TestCase

from mock import Mock

from lizard_portal.configurations_retriever import ConfigurationFactory
from lizard_portal.configurations_retriever import ConfigurationsRetriever
from lizard_portal.configurations_retriever import DescriptionParser
from lizard_portal.configurations_retriever import ZipFileNameRetriever
from lizard_portal.configurations_retriever import MockConfig


class ConfigurationsRetrieverTestSuite(TestCase):

    def test_a(self):
        """Test the right configurations are retrieved."""
        retriever = ConfigurationsRetriever(None, None)
        configuration_list = ['config A', 'config B']
        retriever.retrieve_configurations = \
            (lambda : [MockConfig(config) for config in configuration_list])
        self.assertEqual(configuration_list, retriever.retrieve_configurations_as_dict())

    def test_b(self):
        """Test no configurations are retrieved when there are no zip files."""
        file_name_retriever = Mock()
        file_name_retriever.retrieve = Mock(return_value=[])
        retriever = ConfigurationsRetriever(file_name_retriever, None)
        self.assertEqual([], retriever.retrieve_configurations_as_dict())

    def test_c(self):
        """Test a single configurations is retrieved when there is a single zip file."""
        file_name_retriever = Mock()
        file_name_retriever.retrieve = Mock(return_value=['hello world.zip'])
        configuration_factory = StubConfigurationFactory()
        retriever = ConfigurationsRetriever(file_name_retriever, configuration_factory)
        configurations = retriever.retrieve_configurations()
        self.assertEqual(1, len(configurations))
        self.assertEqual('hello world.zip', configurations[0].zip_file)


class StubConfigurationFactory(object):

    def create(self, zip_file_name):
        configuration = Mock()
        configuration.zip_file = zip_file_name
        return configuration


class ZipFileNameRetrieverTestSuite(TestCase):

    def test_a(self):
        """Test no files are returned when there are no files present."""
        retriever = ZipFileNameRetriever()
        retriever.retrieve_file_names = (lambda : [])
        file_names = retriever.retrieve()
        self.assertEqual([], file_names)

    def test_b(self):
        """Test no files are returned when there are no zip files present."""
        retriever = ZipFileNameRetriever()
        retriever.retrieve_file_names = (lambda : ['hello.txt'])
        file_names = retriever.retrieve()
        self.assertEqual([], file_names)

    def test_c(self):
        """Test the single zip file is returned."""
        retriever = ZipFileNameRetriever()
        retriever.retrieve_file_names = (lambda : ['hello.zip'])
        file_names = retriever.retrieve()
        self.assertEqual(['hello.zip'], file_names)


class StubParser(object):

    def __init__(self, attributes_dict):
        self.as_dict = Mock(return_value=attributes_dict)


class ConfigurationFactoryTestSuite(TestCase):

    def create_factory(self, attributes_dict):
        return ConfigurationFactory(StubParser(attributes_dict))

    def test_a(self):
        factory = self.create_factory({'gebruiker': 'Pieter Swinkels'})
        zip_file, description_file = Mock(), Mock()
        factory.get_description_file = (lambda s: (zip_file, description_file))
        configuration = factory.create('mnt/vss-share/waterbalans_Waternet_20120228_141234.zip')
        self.assertEqual(configuration.zip_file_path, 'mnt/vss-share/waterbalans_Waternet_20120228_141234.zip')
        self.assertEqual(configuration.gebruiker, 'Pieter Swinkels')

    def test_b(self):
        """Test the type of the water balance configuration is set."""
        factory = self.create_factory({})
        zip_file, description_file = Mock(), Mock()
        factory.get_description_file = (lambda s: (zip_file, description_file))
        configuration = factory.create('mnt/vss-share/waterbalans_Waternet_20120228_141234.zip')
        self.assertEqual(configuration.type, 'waterbalans')

    def test_c(self):
        """Test the type of the ESF_1 configuration is set."""
        factory = self.create_factory({})
        zip_file, description_file = Mock(), Mock()
        factory.get_description_file = (lambda s: (zip_file, description_file))
        configuration = factory.create('mnt/vss-share/ESF_1_Waternet_20120228_141234.zip')
        self.assertEqual(configuration.type, 'ESF_1')

    def test_d(self):
        """Test the open description file is also closed."""
        factory = self.create_factory({})
        zip_file, description_file = Mock(), Mock()
        factory.get_description_file = (lambda s: (zip_file, description_file))
        factory.create('hello.zip')
        method, args, kwargs = zip_file.method_calls[0]
        self.assertTrue('close' == method and () == args and {} == kwargs)

    def test_e(self):
        """Test the contents of the description file make up the meta info."""
        factory = self.create_factory({
            'naam':      'nieuwe oppervlakte',
            'gebruiker': 'Pieter Swinkels'})
        zip_file, description_file = Mock(), Mock()
        factory.get_description_file = (lambda s: (zip_file, description_file))
        configuration = factory.create('mnt/vss-share/ESF_1_Waternet_20120228_141234.zip')
        self.assertEqual(configuration.meta_info,
            'naam: nieuwe oppervlakte; gebruiker: Pieter Swinkels')


class DescriptionParserTestSuite(TestCase):

    def setup(self, *lines):
        self.parser = DescriptionParser()
        self.open_file = Mock()
        self.open_file.readlines = Mock(return_value=lines)

    def test_a(self):
        """Test that an option value that contains a space is parsed."""
        self.setup('naam = nieuwe oppervlakte')
        description_dict = self.parser.as_dict(self.open_file)
        self.assertEqual({'naam': 'nieuwe oppervlakte'}, description_dict)

    def test_b(self):
        """Test that multiple options are parsed."""
        lines = 'naam = nieuwe oppervlakte', 'gebruiker = Pieter Swinkels'
        self.setup(*lines)
        description_dict = self.parser.as_dict(self.open_file)
        self.assertEqual(2, len(description_dict))
        self.assertEqual('nieuwe oppervlakte', description_dict['naam'])
        self.assertEqual('Pieter Swinkels', description_dict['gebruiker'])

    def test_c(self):
        """Test that trailing spaces of a value are removed."""
        self.setup('naam = nieuwe oppervlakte  ')
        description_dict = self.parser.as_dict(self.open_file)
        self.assertEqual('nieuwe oppervlakte', description_dict['naam'])

    def test_d(self):
        """Test that an invalid option is not parsed."""
        self.setup('naam nieuwe oppervlakte')
        description_dict = self.parser.as_dict(self.open_file)
        self.assertEqual({}, description_dict)

    def test_e(self):
        """Test that an attribute name is lowercased."""
        self.setup('Naam = nieuwe oppervlakte')
        description_dict = self.parser.as_dict(self.open_file)
        self.assertEqual('nieuwe oppervlakte', description_dict['naam'])
