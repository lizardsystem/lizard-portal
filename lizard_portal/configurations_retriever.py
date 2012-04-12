#!/usr/bin/python
# -*- coding: utf-8 -*-

# pylint: disable=C0111

# Copyright (c) 2012 Nelen & Schuurmans.  GPL licensed, see LICENSE.rst.

import logging
import re
import os

from zipfile import ZipFile

from django.conf import settings

from dbfpy import dbf
from mock import Mock

from lizard_area.models import Area
from lizard_portal.models import ConfigurationToValidate
from lizard_security.models import DataSet


logger = logging.getLogger(__name__)


class Database(object):
    """Provides a wrapper around the Django database."""

    @property
    def areas(self):
        return Area.objects

    @property
    def configurations(self):
        return ConfigurationToValidate.objects

    @property
    def data_sets(self):
        return DataSet.objects

    def ConfigurationToValidate(self):
        return ConfigurationToValidate()


class ConfigurationsRetriever(object):
    """Implements the functionality to retrieve the configurations to validate.

    Instance parameters:
      *db*
        interface to the database (implemented to ease unit testing)

    """
    def __init__(self):
        self.db = Database()

    def retrieve_configurations_as_dict(self):
        configurations = self.retrieve_configurations()
        return [configuration.as_dict() for configuration in configurations]

    def retrieve_configurations(self):
        """Return the list of configurations."""
        return self.db.configurations.all()


class ConfigurationStore(object):
    """Implements the functionality to create the configurations to validate.

    Instance parameters:
      *db*
        interface to the database (implemented to ease unit testing)

    """
    def __init__(self):
        self.db = Database()
        self.retrieve_zip_names = ZipFileNameRetriever().retrieve
        self.retrieve_attrs_from_name = AttributesFromNameRetriever().retrieve
        self.retrieve_attrs_from_config = ConfigurationSpecRetriever().retrieve

    def supply(self):
        for zip_name in self.retrieve_zip_names():
            attrs_from_name = self.retrieve_attrs_from_name(zip_name)
            self.extract(zip_name, attrs_from_name['file_path'])
            for attrs in self.retrieve_attrs_from_config(attrs_from_name['file_path'], attrs_from_name['config_type']):
                config = self.db.ConfigurationToValidate()
                attrs.update(attrs_from_name)
                config.set_attributes(attrs)
                try:
                    logger.info('Saving configuration %s', config)
                    config.save()
                except:
                    logger.warning('Unable to save the configuration: probably it is incomplete')
            self.delete(zip_name)

    def retrieve_zip_names(self):
        """Retrieve the path to all the configuration zip files.

        This method is not implemented here and should be set through
        dependency injection.

        """
        assert False

    def retrieve_attrs_from_name(self, zip_name):
        """Retrieve attributes of the new configuration from the given name.

        The name of the zip file specifies the config type of the configuration
        and the water manager and is also used to determine the directory to
        which the zip file should be extracted. This method returns those
        attributes in a dict with keys 'config_type', 'data_set' and
        'file_path'.

        Parameters:
          *zip_name*
             name of the zip file that contains the configurations

        This method is not implemented here and should be set through
        dependency injection.

        """
        assert False

    def retrieve_attrs_from_config(self, dir_name, config_type):
        """Retrieve the list of configuration attributes.

        Each element of the list is a dict that maps each attribute name
        to its attribute value for a single new configuration.

        Parameters:
          *dir_name*
             directory with the configuration specs of a single water manager
          *config_type*
             string that specifies the type of the configuration

        This method is not implemented here and should be set through
        dependency injection.

        """
        assert False

    def extract(self, zip_name, destination_dir):
        """Extract the given zip file to the given destination dir."""
        ZipFile(zip_name).extractall(path=destination_dir)

    def delete(self, file_name):
        """Delete the given file."""
        os.remove(file_name)


class AttributesFromNameRetriever(object):

    def __init__(self):
        self.dbf_directory = '/tmp'
        self.regex = re.compile('^([\w\d]*)_([a-zA-Z]*)_\d{8}_\d{6}.zip')

    def retrieve(self, zip_name):
        self.zip_name = zip_name
        return { 'file_path':   self.file_path,
                 'config_type': self.config_type,
                 'data_set':    self.data_set }

    @property
    def file_path(self):
        """Return the destination directory using the name of the zip file."""
        _, file_name = os.path.split(self.zip_name)
        return os.path.join(self.dbf_directory, file_name[:-4])

    @property
    def config_type(self):
        """Return the configuration type using the name of the zip file."""
        _, file_name = os.path.split(self.zip_name)
        match = self.regex.search(file_name)
        if match:
            matched_string = match.group(1)
            return matched_string.lower().replace('_', '')

    @property
    def data_set(self):
        """Return the water manager name using the name of the zip file."""
        _, file_name = os.path.split(self.zip_name)
        match = self.regex.search(file_name)
        if match:
            matched_string = match.group(2)
            return matched_string


class ConfigurationSpecRetriever(object):

    def __init__(self):
        self.retrieve_meta_info = DescriptionParser().as_dict

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

    def as_dict(self, file_name):
        """Return the dict of attribute settings in the given open file."""
        attributes = {}
        open_file = self.open(file_name)
        for line in open_file.readlines():
            match = self.regex.search(line)
            if match is not None:
                option = self.regex.search(line).groups()
                if option is not None and len(option) == 2:
                    attributes[option[0].lower()] = option[1].rstrip(' ')
        open_file.close()
        return attributes

    def open(self, file_name):
        return open(file_name)


class MockConfig(object):

    def __init__(self, as_dict):
        self.as_dict = Mock(return_value=as_dict)


def create_configurations_retriever():
    return ConfigurationsRetriever(Database())
