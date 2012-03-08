#!/usr/bin/python
# -*- coding: utf-8 -*-

# pylint: disable=C0111

# Copyright (c) 2012 Nelen & Schuurmans.  GPL licensed, see LICENSE.rst.

import os
import re

from zipfile import ZipFile

from mock import Mock


class ConfigurationsRetriever(object):
    """Implements the functionality to retrieve the configurations.

    A ConfigurationsRetriever depends on two other objects to retrieve the
    configurations, namely one to retrieve the names of the zip files that
    specify the configurations and one to a configuration given a zip file
    name. The former object, a file names retriever, should support the
    method::

        def retrieve(self)

    and the latter object should support the method::

        def create(self, file_name)

    """
    def __init__(self, file_names_retriever, configuration_factory):
        self.file_names_retriever = file_names_retriever
        self.configuration_factory = configuration_factory

    def retrieve_configurations_as_dict(self):
        configurations = self.retrieve_configurations()
        return [configuration.as_dict() for configuration in configurations]

    def retrieve_configurations(self):
        """Return the list of configurations."""
        configurations = []
        for file_name in self.file_names_retriever.retrieve():
            configuration = self.configuration_factory.create(file_name)
            configurations.append(configuration)
        return configurations


class ZipFileNameRetriever(object):
    """Implements the functionality to retrieve the paths to the zip files.

    The relevant zip files are stored in a directory tree whose root is
    specified by property ``root_directory``.

    """
    def retrieve(self):
        """Return the list of zip file names."""
        zip_file_names = []
        for file_name in self.retrieve_file_names():
            if file_name[-4:] == '.zip':
                zip_file_names.append(file_name)
        return zip_file_names

    def retrieve_file_names(self):
        """Return the list of all file names."""
        result = []
        for (dir_path, dir_names, file_names) in os.walk(self.root_directory):
            for file_name in file_names:
                result.append(os.path.join(dir_path, file_name))
        return result

    @property
    def root_directory(self):
        return '/home/pieter/tmp'


class ConfigurationFactory(object):
    """Implements the creation of a configuration from a named zip file.

    The configuration that a ConfigurationFactory creates, is an object of
    class Configuration.

    The named zip file contains an INI style file that specifies the attributes
    of the configuration. A ConfigurationFactory depends on another object, a
    so-called description parser, to retrieve these attributes from that
    file. That description parser, should support the method::

        def as_dict(self, file)

    """
    def __init__(self, description_parser):
        self.parser = description_parser

    def create(self, zip_file_path):
        """Return a Configuration from the given named zip file."""
        configuration = Configuration()
        configuration.meta_info = ''
        configuration.polder = 'hard coded value'
        configuration.zip_file_path = zip_file_path
        self._set_attributes_from_file(configuration)
        return configuration

    def _set_attributes_from_file(self, configuration):
        zip_file_path = configuration.zip_file_path
        zip_file, description_file = self.get_description_file(zip_file_path)
        description_dict = self.parser.as_dict(description_file)
        for key, value in description_dict.items():
            setattr(configuration, key, value)
            configuration.meta_info += '%s: %s' % (key, value)
        zip_file.close()

    def get_description_file(self, zip_file_name):
        """Return the file objects to zip file and the description file.

        Parameter:
          *zip_file_name* name of zip file that contains the description file

        """
        zip_file = ZipFile(zip_file_name)
        return zip_file, zip_file.open('description.txt')


class Configuration(object):
    """Stores the attributes of a configuration."""

    def __init__(self):
        self.regex = re.compile('^([\w\d]*)_[a-zA-Z]*_\d{8}_\d{6}.zip')

    @property
    def type(self):
        """Return the configuration type using the name of the zip file.

        """
        _, file_name = os.path.split(self.zip_file_path)
        match = self.regex.search(file_name)
        if match and len(match.groups()) == 1:
            return match.group(1)


class DescriptionParser(object):
    """Implements the functionality to parse a file with attribute settings."""

    def __init__(self):
        self.regex = re.compile('(\w*)\s*=\s*([\w ]*)')

    def as_dict(self, open_file):
        """Return the dict of attribute settings in the given open file."""
        attributes = {}
        for line in open_file.readlines():
            match = self.regex.search(line)
            if match is not None:
                option = self.regex.search(line).groups()
                if option is not None and len(option) == 2:
                    attributes[option[0]] = option[1].rstrip(' ')
        return attributes


class MockConfig(object):

    def __init__(self, as_dict):
        self.as_dict = Mock(return_value=as_dict)


def create_configurations_retriever():
    return ConfigurationsRetriever(ZipFileNameRetriever(), ConfigurationFactory(DescriptionParser()))
