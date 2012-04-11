#!/usr/bin/python
# -*- coding: utf-8 -*-

# pylint: disable=C0111

# Copyright (c) 2012 Nelen & Schuurmans.  GPL licensed, see LICENSE.rst.

import re
import os

from zipfile import ZipFile

from django.conf import settings

from dbfpy import dbf
from mock import Mock

from lizard_portal.models import ConfigurationToValidate


class ConfigurationsRetriever(object):
    """Implements the functionality to retrieve the configurations.

    Parameter:
      *db*
        interface to the database to ease unit testing

    """
    def __init__(self, database):
        self.db = database

    def retrieve_configurations_as_dict(self):
        configurations = self.retrieve_configurations()
        return [configuration.as_dict() for configuration in configurations]

    def retrieve_configurations(self):
        """Return the list of configurations."""
        return self.db.configurations.all()


class Database(object):
    """Provides a wrapper around the Django database."""

    @property
    def configurations(self):
        return ConfigurationToValidate.objects.all()

    def ConfigurationToValidate(self):
        return ConfigurationToValidate()



class ConfigurationStore(object):

    def __init__(self):
        self.db = Database()
        self.retrieve_zip_names = ZipFileNameRetriever().retrieve
        self.retrieve_config_type = ConfigurationTypeRetriever().retrieve
        self.retrieve_config_specs = ConfigurationSpecRetriever().retrieve

    def supply(self):
        config = self.db.ConfigurationToValidate()
        for zip_name in self.retrieve_zip_names():
            dir_name = self.retrieve_destination_dir(zip_name)
            config_type = self.retrieve_config_type(zip_name)
            self.extract(zip_name, dir_name)
            for config_spec in self.retrieve_config_specs(dir_name, config_type):
                for key, value in config_spec.items():
                    if key == 'area_code':
                        config.area = self.db.areas.get(code=value)
                    else:
                        setattr(config, key, value)
                config.file_path = dir_name
                config.action = ConfigurationToValidate.KEEP
                config.save()

    def retrieve_zip_names(self):
        """Retrieve the path to all the configuration zip files .

        This method is not implemented here and should be set through
        dependency injection.

        """
        assert False

    def retrieve_destination_dir(self, zip_name):
        return os.path.join(self.dbf_directory, zip_name[:-4])

    def extract(self, zip_name, destination_dir):
        """Extract the given zip file to the given destination dir."""
        ZipFile(zip_name).extractall(destination_dir)

    def retrieve_config_type(self, zip_name):
        """Return the configuration type using the name of the zip file.

        Parameters:
          *zip_name*
             path to the zip file with the configurations of a water manager

        This method is not implemented here and should be set through
        dependency injection.

        """
        assert False

    def retrieve_config_specs(self, dir_name, config_type):
        """Retrieve the list of configuration specifications.

        A configuration specification is a dict that maps each attribute name
        to its attribute value.

        Parameters:
          *dir_name*
             directory with the configuration specs of a single water manager
          *config_type*
             string that specifies the type of the configuration

        This method is not implemented here and should be set through
        dependency injection.

        """
        assert False

    @property
    def dbf_directory(self):
        return '/tmp'


class ConfigurationTypeRetriever(object):

    def __init__(self):
        self.regex = re.compile('^([\w\d]*)_[a-zA-Z]*_\d{8}_\d{6}.zip')

    def retrieve(self, zip_name):
        """Return the configuration type using the name of the zip file."""
        _, file_name = os.path.split(zip_name)
        match = self.regex.search(file_name)
        if match and len(match.groups()) == 1:
            matched_string = match.group(1)
            return matched_string.lower().replace('_', '')


class ConfigurationSpecRetriever(object):

    def retrieve(self, dir_name, config_type):
        dbf_name = os.path.join(dir_name, 'aanafvoer_%s.dbf' % config_type)
        config_specs = []
        for area_code in self.retrieve_area_codes(dbf_name):
            meta_info_name = os.path.join(dir_name, 'description.txt')
            config_spec = self.retrieve_meta_info(meta_info_name)
            config_spec['area_code'] = area_code
            config_specs.append(config_spec)
        return config_specs

    def retrieve_area_codes(self, dbf_name):
        """Return the list of area codes in the given dbf file."""
        return [rec['GAFIDENT'] for rec in dbf.Dbf(dbf_name)]

    def retrieve_meta_info(self, meta_info_name):
        """Return the meta info specified in the given file.

        This method returns the meta info as a dict of attribute name to
        attribute value.

        This method is not implemented here and should be set through
        dependency injection.

        """
        assert False


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
        return settings.VALIDATION_ROOT


class DescriptionParser(object):
    """Implements the functionality to parse a file with attribute settings."""

    def __init__(self):
        self.regex = re.compile('(\w*)\s*=\s*(.*)')

    def as_dict(self, open_file):
        """Return the dict of attribute settings in the given open file."""
        attributes = {}
        for line in open_file.readlines():
            match = self.regex.search(line)
            if match is not None:
                option = self.regex.search(line).groups()
                if option is not None and len(option) == 2:
                    attributes[option[0].lower()] = option[1].rstrip(' ')
        return attributes


class MockConfig(object):

    def __init__(self, as_dict):
        self.as_dict = Mock(return_value=as_dict)


def create_configurations_retriever():
    return ConfigurationsRetriever(Database())
