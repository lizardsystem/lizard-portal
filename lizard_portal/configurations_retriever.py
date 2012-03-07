#!/usr/bin/python
# -*- coding: utf-8 -*-

# pylint: disable=C0111

# Copyright (c) 2012 Nelen & Schuurmans.  GPL licensed, see LICENSE.rst.

import os
import re

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
    """Implements the functionality to create a configuration from a ZIP file.

    The configuration created is an object of class Configuration.

    The ZIP file contains an INI style file that specifies the attributes of
    the configuration. A configuration factory object depends on another object
    to retrieve these attributes from that file. That other object, wich we
    call a description parser, should support the method::

        def as_dict(self, file)

    """
    def __init__(self, description_parser):
        self.parser = description_parser

    def create(self, zip_file):
        """Return a Configuraton based on the information in the given ZIP file.

        """
        configuration = Configuration()
        configuration.zip_file = zip_file
        description_file = self.get_description_file(zip_file)
        description_dict = self.parser.as_dict(description_file)
        for key, value in description_dict.items():
            setattr(configuration, key, value)
        return configuration

    def get_description_file(self, zip_file_name):
        """Return the file object to the description file in the given ZIP file.

        Parameter:
          *zip_file_name* name of ZIP file that contains the description file

        """
        pass


class Configuration(object):
    """Stores the attributes of a configuration."""
    pass


class DescriptionParser(object):
    """Implements the functionality to parse a file with attribute settings."""

    def __init__(self):
        self.regex = re.compile('(\w*)\s*=\s*([\w ]*)')

    def as_dict(self, open_file):
        """Return the dict of attribute settings in the given open file."""
        attributes = {}
        for line in self.read_lines(open_file):
            match = self.regex.search(line)
            if match is not None:
                option = self.regex.search(line).groups()
                if option is not None and len(option) == 2:
                    attributes[option[0]] = option[1].rstrip(' ')
        return attributes


class MockConfig(object):

    def __init__(self, as_dict):
        self.as_dict = Mock(return_value=as_dict)
