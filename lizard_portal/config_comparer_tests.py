#!/usr/bin/python
# -*- coding: utf-8 -*-

# pylint: disable=C0111

# Copyright (c) 2012 Nelen & Schuurmans.  GPL licensed, see LICENSE.rst.

import logging

from unittest import TestCase

from dbfpy import dbf
from mock import Mock

from django.utils.translation import ugettext as tr

from lizard_portal.configurations_retriever import ConfigurationToValidate


logger = logging.getLogger(__name__)


class Diff(object):
    """Describes the differences between new and current configurations.

    Instance parameters:
      *new_areas*
         list of area identifications only specified in the new configurations
      *changed_areas*
         dict of area identification to attribute name to tuple of new and
         current attribute values

    """
    def __init__(self):
        self.new_areas = []
        self.changed_areas = {}

    def __eq__(self, other):
        return self.new_areas == other.new_areas and \
            self.changed_areas == other.changed_areas


class ConfigComparer(object):

    def __init__(self):
        self.get_candidate_config_as_dict = AreaConfigDbf().as_dict

    def compare(self, config):
        """Return the differences for the given configuration."""
        candidate = self.get_candidate_config_as_dict(self, config)
        current = self.get_current_config_as_dict(self, config)
        diff = Diff()
        for area_ident, area_attrs in candidate.items():
            try:
                current_attrs = current[area_ident]
            except KeyError:
                diff.new_areas.append(area_ident)
                continue
            for attr_name, attr_value in area_attrs.items():
                current_attr_value = current_attrs.get(attr_name, tr('not present'))
                if attr_value != current_attr_value:
                    diff_for_key = diff.changed_areas.setdefault(area_ident, {})
                    diff_for_key[attr_name] = (attr_value, current_attr_value)
        return diff

    def get_candidate_config_as_dict(self, config):
        pass

    def get_current_config_as_dict(self, config):
        pass

class ConfigComparerTestSuite(TestCase):

    def test_a(self):
        """Test the difference of a single field.

        The field is present in both configurations but with different values.

        """
        config = ConfigurationToValidate()
        comparer = ConfigComparer()

        candidate_config = { '3201': { 'DIEPTE': '1.17' } }
        current_config = { '3201' : { 'DIEPTE': '1.18' } }
        comparer.get_candidate_config_as_dict = lambda s, c: candidate_config
        comparer.get_current_config_as_dict = lambda s, c: current_config

        diff = comparer.compare(config)
        expected_diff = Diff()
        expected_diff.changed_areas = {
            '3201': {
                'DIEPTE': ('1.17', '1.18'),
                }
            }
        self.assertEqual(expected_diff, diff)

    def test_b(self):
        """Test the difference of a single field.

        The field is present in only one configuration.

        """
        config = ConfigurationToValidate()
        comparer = ConfigComparer()

        candidate_config = { '3201': { 'DIEPTE': '1.17' } }
        current_config = { '3201' : {} }
        comparer.get_candidate_config_as_dict = lambda s, c: candidate_config
        comparer.get_current_config_as_dict = lambda s, c: current_config

        diff = comparer.compare(config)
        expected_diff = Diff()
        expected_diff.changed_areas = {
            '3201': {
                'DIEPTE': ('1.17', tr('not present')),
                }
            }
        self.assertEqual(expected_diff, diff)

    def test_c(self):
        """Test the difference of a single field.

        The field is present in only one configuration. The configuration is
        not yet present.

        """
        config = ConfigurationToValidate()
        comparer = ConfigComparer()

        candidate_config = { '3201': { 'DIEPTE': '1.17' } }
        current_config = { }
        comparer.get_candidate_config_as_dict = lambda s, c: candidate_config
        comparer.get_current_config_as_dict = lambda s, c: current_config

        diff = comparer.compare(config)
        expected_diff = Diff()
        expected_diff.new_areas = ['3201']
        self.assertEqual(expected_diff, diff)

    def test_d(self):
        """Test the equality of a single field."""
        config = ConfigurationToValidate()
        comparer = ConfigComparer()

        candidate_config = { '3201': { 'DIEPTE': '1.17' } }
        current_config = { '3201': { 'DIEPTE': '1.17' } }
        comparer.get_candidate_config_as_dict = lambda s, c: candidate_config
        comparer.get_current_config_as_dict = lambda s, c: current_config

        diff = comparer.compare(config)
        expected_diff = Diff()
        self.assertEqual(expected_diff, diff)


class AreaConfigDbf(object):
    """Implements the retrieval of the area records of a configuration.

    Instance parameter:
      *record_store*
        interface to the Dbf file

    """

    def as_dict(self, config):
        """Return the dict of area records from the given configuration.

        The dict maps the value of the GAFIDENT field of each area record to
        each record.

        """
        result = {}
        for record in self.retrieve_records(config.area_dbf):
            try:
                result[record['GAFIDENT']] = record
            except KeyError:
                logger.warning("area configuration file '%s' does not have a "
                               "GAFIDENT field", config.area_dbf)
                break
        return result

    def retrieve_records(self, dbf_name):
        """Return the list of records from the given file.

        Each record is specified as a dict from attribute name to attribute
        value.

        """
        return [rec for rec in dbf.Dbf(dbf_name)]

class AreaConfigDbfTestSuite(TestCase):

    def setUp(self):
        self.config = ConfigurationToValidate()
        self.config.config_type = 'esf1'
        self.config.file_path = '/path'
        self.area_dbf = AreaConfigDbf()
        record = {'GAFIDENT': '3201', 'DIEPTE': ' 1.17'}
        self.area_dbf.retrieve_records = Mock(return_value=[record])

    def test_a(self):
        """Test the retrieval of a single record."""
        area2attrs = self.area_dbf.as_dict(self.config)
        self.assertEqual({'3201': {'GAFIDENT': '3201', 'DIEPTE': ' 1.17'}}, area2attrs)

    def test_b(self):
        """Test the records are retrieved from the right file."""
        self.area_dbf.as_dict(self.config)
        args, kwargs = self.area_dbf.retrieve_records.call_args
        self.assertEqual('/path/aanafvoer_esf1.dbf', args[0])

    def test_c(self):
        """Test the retrieval of records without a GAFIDENT field."""
        self.area_dbf.retrieve_records = Mock(return_value=[{'DIEPTE': ' 1.17'}])
        area2attrs = self.area_dbf.as_dict(self.config)
        self.assertEqual(0, len(area2attrs))
