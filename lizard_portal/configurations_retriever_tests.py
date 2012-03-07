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


class StubDescriptionParser(object):

    def as_dict(self, description_file):
        return {'gebruiker': 'Pieter Swinkels'}


class ConfigurationFactoryTestSuite(TestCase):

    def test_a(self):
        factory = ConfigurationFactory(StubDescriptionParser())
        description_file = Mock()
        factory.get_description_file = (lambda s: description_file)
        configuration = factory.create('mnt/vss-share/waterbalans_Waternet_20120228_141234.zip')
        self.assertEqual(configuration.zip_file, 'mnt/vss-share/waterbalans_Waternet_20120228_141234.zip')
        self.assertEqual(configuration.gebruiker, 'Pieter Swinkels')

    def test_b(self):
        """Test the open description file is also closed."""
        factory = ConfigurationFactory(StubDescriptionParser())
        description_file = Mock()
        factory.get_description_file = (lambda s: description_file)
        factory.create('hello.zip')
        method, args, kwargs = description_file.method_calls[0]
        self.assertTrue('close' == method and () == args and {} == kwargs)




class DescriptionParserTestSuite(TestCase):

    def create_parser(self, *lines):
        parser = DescriptionParser()
        parser.read_lines = Mock(return_value=lines)
        return parser

    def test_a(self):
        """Test that an option value that contains a space is parsed."""
        parser = self.create_parser('naam = nieuwe oppervlakte')
        self.assertEqual({'naam': 'nieuwe oppervlakte'}, parser.as_dict('an open file'))

    def test_b(self):
        """Test that multiple options are parsed."""
        lines = 'naam = nieuwe oppervlakte', 'gebruiker = Pieter Swinkels'
        parser = self.create_parser(*lines)
        description_dict = parser.as_dict('an open file')
        self.assertEqual(2, len(description_dict))
        self.assertEqual('nieuwe oppervlakte', description_dict['naam'])
        self.assertEqual('Pieter Swinkels', description_dict['gebruiker'])

    def test_c(self):
        """Test that trailing spaces of a value are removed."""
        parser = self.create_parser('naam = nieuwe oppervlakte')
        parser.read_lines = Mock(return_value=['naam = nieuwe oppervlakte  '])
        description_dict = parser.as_dict('an open file')
        self.assertEqual('nieuwe oppervlakte', description_dict['naam'])

    def test_d(self):
        """Test that an invalid option is not parsed."""
        parser = self.create_parser('naam nieuwe oppervlakte')
        parser.read_lines = Mock(return_value=['naam nieuwe oppervlakte'])
        self.assertEqual({}, parser.as_dict('an open file'))


