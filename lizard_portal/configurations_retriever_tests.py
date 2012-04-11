#!/usr/bin/python
# -*- coding: utf-8 -*-

# pylint: disable=C0111

# Copyright (c) 2012 Nelen & Schuurmans.  GPL licensed, see LICENSE.rst.

import re
import os

from UserList import UserList
from unittest import TestCase
from zipfile import ZipFile

from mock import Mock

from lizard_area.models import Area
from lizard_portal.configurations_retriever import ConfigurationFactory
from lizard_portal.configurations_retriever import ConfigurationsRetriever
from lizard_portal.configurations_retriever import Database
from lizard_portal.configurations_retriever import DescriptionParser
from lizard_portal.configurations_retriever import ZipFileNameRetriever
from lizard_portal.models import ConfigurationToValidate


class MockQuerySet(UserList):

    def __init__(*args, **kwargs):
        UserList.__init__(*args, **kwargs)

    def all(self):
        return self.data

    def filter(self, *args, **kwargs):
        result = MockQuerySet()
        for o in self.data:
            print o.action
            is_searched_object = True
            for keyword, value in kwargs.items():
                print keyword, value
                is_searched_object = getattr(o, keyword) == value
                if not is_searched_object:
                    break
            if is_searched_object:
                result.append(o)
        return result

    def get(self, *args, **kwargs):
        result = None
        for o in self.data:
            is_searched_object = True
            for keyword, value in kwargs.items():
                is_searched_object = getattr(o, keyword) == value
                if not is_searched_object:
                    break
            if is_searched_object:
                result = o
                break
        if result is None:
            assert False
        return result

    def count(self):
        return len(self.data)


class MockDatabase(object):

    def __init__(self):
        self.areas = MockQuerySet()
        self.configurations = MockQuerySet()

    def ConfigurationToValidate(self):
        config = Mock(ConfigurationToValidate)
        config.save = lambda c=config: self.configurations.append(c)
        return config

    def Area(self):
        area = Mock(Area)
        area.save = lambda a=area: self.areas.append(a)
        return area

class ConfigurationsRetrieverTestSuite(TestCase):

    def setUp(self):
        self.db = MockDatabase()

    def test_a(self):
        """Test no configurations are retrieved.

        There are no configurations to validate.

        """
        retriever = ConfigurationsRetriever(self.db)
        self.assertEqual([], retriever.retrieve_configurations())

    def test_b(self):
        """Test a single configuration is retrieved."""
        config = self.db.ConfigurationToValidate()
        config.save()
        retriever = ConfigurationsRetriever(self.db)
        self.assertEqual([config], retriever.retrieve_configurations())

    # def test_a(self):
    #     """Test the right configurations are retrieved."""
    #     retriever = ConfigurationsRetriever(None, None)
    #     configuration_list = ['config A', 'config B']
    #     retriever.retrieve_configurations = \
    #         (lambda : [MockConfig(config) for config in configuration_list])
    #     self.assertEqual(configuration_list, retriever.retrieve_configurations_as_dict())

    # def test_b(self):
    #     """Test no configurations are retrieved when there are no zip files."""
    #     file_name_retriever = Mock()
    #     file_name_retriever.retrieve = Mock(return_value=[])
    #     retriever = ConfigurationsRetriever(file_name_retriever, None)
    #     self.assertEqual([], retriever.retrieve_configurations_as_dict())

    # def test_c(self):
    #     """Test a single configurations is retrieved when there is a single zip file."""
    #     file_name_retriever = Mock()
    #     file_name_retriever.retrieve = Mock(return_value=['hello world.zip'])
    #     configuration_factory = StubConfigurationFactory()
    #     retriever = ConfigurationsRetriever(file_name_retriever, configuration_factory)
    #     configurations = retriever.retrieve_configurations()
    #     self.assertEqual(1, len(configurations))
    #     self.assertEqual('hello world.zip', configurations[0].zip_file)


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

    def test_f(self):
        """Test that attribute values can contain non-alphanumeric characters.
        """
        self.setup('datum = 08-03-2012 20:13:00')
        description_dict = self.parser.as_dict(self.open_file)
        self.assertEqual('08-03-2012 20:13:00', description_dict['datum'])


class NoSelf(object):

    pass


class Self(object):

    def get_self(self):
        return self


class OverrideSelf(object):

    def get_self(self):
        return self


class OverrideSelfTestSuite(TestCase):

    def test_a(self):
        """Test replace a method by a method changes self."""
        s = Self()
        self.assertEqual(s, s.get_self())
        o = OverrideSelf()
        s.get_self = o.get_self
        self.assertEqual(o, s.get_self())

    def test_b(self):
        """Test replace a method by a function with a self argument fails."""
        s = Self()
        self.assertEqual(s, s.get_self())
        s.get_self = get_self
        try:
            self.assertEqual(s, s.get_self())
            self.assertTrue(False)
        except TypeError:
            pass

    def test_c(self):
        """Test replace a method by a function with a self argument."""
        NoSelf.get_self = get_self
        s = NoSelf()
        self.assertEqual(s, s.get_self())
        print "type(s.get_self)", type(s.get_self)
        print "s.get_self", s.get_self
        print "s.__dict__", s.__dict__
        self.assertEqual(s, s.get_self())

    def test_d(self):
        """Test replace a method by a function without a self argument."""
        s = Self()
        self.assertEqual(s, s.get_self())
        global global_s
        global_s = s
        s.get_self = get_self_c
        self.assertEqual(s, s.get_self())


def get_self(self):
    return self

global_s = None

def get_self_c():
    return global_s


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


class ConfigurationTypeRetrieverTestSuite(TestCase):

    def test_a(self):
        """Test the retrieval of configuration type 'waterbalans'."""
        retriever = ConfigurationTypeRetriever()
        config_type = retriever.retrieve('mnt/vss-share/waterbalans_Waternet_20120228_141234.zip')
        self.assertEqual('waterbalans', config_type)

    def test_b(self):
        """Test the retrieval of configuration type 'esf1'."""
        retriever = ConfigurationTypeRetriever()
        config_type = retriever.retrieve('mnt/vss-share/ESF_1_Waternet_20120228_141234.zip')
        self.assertEqual('esf1', config_type)


class ConfigurationStoreTestSuite(TestCase):

    def setUp(self):
        self.db = MockDatabase()
        area = self.db.Area()
        area.code = '3201'
        area.save()
        self.store = ConfigurationStore()
        self.store.db = self.db
        self.store.extract = Mock()
        self.store.retrieve_zip_names = lambda : ['waterbalans_Waternet_04042012_081400.zip']
        self.store.retrieve_config_type =  lambda zip_name: 'waterbalans'
        self.store.retrieve_config_specs = lambda dir_name, config_type: [{'area_code': '3201'}]

    def test_a(self):
        """Test the supply of a single ConfigurationToValidate."""
        self.store.supply()
        self.assertEqual(1, self.db.configurations.count())

    def test_b(self):
        """Test the zip file name specifies the directory of a single ConfigurationToValidate."""
        self.store.supply()
        config = self.db.configurations.all()[0]
        self.assertEqual('/tmp/waterbalans_Waternet_04042012_081400', config.file_path)

    def test_c(self):
        """Test the new ConfigurationToValidate points to the correct Area."""
        self.store.supply()
        config = self.db.configurations.all()[0]
        self.assertEqual(self.db.areas.all()[0], config.area)

    def test_d(self):
        """Test the new ConfigurationToValidate should be kept."""
        self.store.supply()
        config = self.db.configurations.all()[0]
        self.assertEqual(ConfigurationToValidate.KEEP, config.action)

    def test_e(self):
        """Test retrieve_config_specs is called correctly."""
        self.store.retrieve_config_specs = Mock(return_value=self.store.retrieve_config_specs("don't care", "don't care"))
        self.store.supply()
        args, kwargs = self.store.retrieve_config_specs.call_args
        self.assertEqual('/tmp/waterbalans_Waternet_04042012_081400', args[0])
        self.assertEqual('waterbalans', args[1])


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
        """Return the list of area codes in the given dbf file.

        This method is not implemented here and should be set through
        dependency injection.

        """
        assert False

    def retrieve_meta_info(self, meta_info_name):
        """Return the meta info specified in the given file.

        This method returns the meta info as a dict of attribute name to
        attribute value.

        This method is not implemented here and should be set through
        dependency injection.

        """
        assert False


class ConfigurationSpecRetrieverTestSuite(TestCase):

    def setUp(self):
        self.retriever = ConfigurationSpecRetriever()
        self.retriever.retrieve_area_codes = Mock(return_value=['3201'])
        self.retriever.retrieve_meta_info = Mock(return_value={'user': 'Pieter Swinkels'})

    def test_a(self):
        """Test the construction of a single ConfigurationSpec."""
        dir_name = '/path/to/configuration/directory'
        config_type = 'waterbalans'
        config_specs = self.retriever.retrieve(dir_name, config_type)
        self.assertEqual(1, len(config_specs))
        self.assertEqual('3201', config_specs[0]['area_code'])

    def test_b(self):
        """Test retrieve_area_codes_from_dbf is called correctly."""
        dir_name = '/path/to/configuration/directory'
        config_type = 'waterbalans'
        self.retriever.retrieve(dir_name, config_type)
        args, kwargs = self.retriever.retrieve_area_codes.call_args
        self.assertEqual('/path/to/configuration/directory/aanafvoer_waterbalans.dbf', args[0])

    def test_c(self):
        """Test retrieve_area_codes_from_dbf is called correctly."""
        dir_name = '/path/to/configuration/directory'
        config_type = 'esf1'
        self.retriever.retrieve(dir_name, config_type)
        args, kwargs = self.retriever.retrieve_area_codes.call_args
        self.assertEqual('/path/to/configuration/directory/aanafvoer_esf1.dbf', args[0])

    def test_d(self):
        """Test the retrieval of the 'user' attribute."""
        dir_name = '/path/to/configuration/directory'
        config_type = 'waterbalans'
        config_specs = self.retriever.retrieve(dir_name, config_type)
        self.assertEqual(1, len(config_specs))
        self.assertEqual('Pieter Swinkels', config_specs[0]['user'])

    def test_e(self):
        """Test retrieva_meta_info receives the right parameters."""
        dir_name = '/path/to/configuration/directory'
        config_type = 'waterbalans'
        self.retriever.retrieve(dir_name, config_type)
        args, kwargs = self.retriever.retrieve_meta_info.call_args
        self.assertEqual('/path/to/configuration/directory/description.txt', args[0])
