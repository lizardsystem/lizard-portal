#!/usr/bin/python
# -*- coding: utf-8 -*-

# pylint: disable=C0111

# Copyright (c) 2012 Nelen & Schuurmans.  GPL licensed, see LICENSE.rst.

from unittest import TestCase

from django.utils.translation import ugettext as tr

from lizard_portal.configurations_retriever import ConfigurationToValidate

class Diff(object):

    def __init__(self):
        self.new_configs = []
        self.changed_configs = {}

    def __eq__(self, other):
        return self.new_configs == other.new_configs and \
            self.changed_configs == other.changed_configs


class ConfigComparer(object):

    def compare(self, config):
        candidate = self.get_candidate_config_as_dict(self, config)
        current = self.get_current_config_as_dict(self, config)

        diff = Diff()
        for area_ident, area_attrs in candidate.items():
            try:
                current_attrs = current[area_ident]
            except KeyError:
                diff.new_configs.append(area_ident)
                continue
            for attr_name, attr_value in area_attrs.items():
                current_attr_value = current_attrs.get(attr_name, tr('not present'))
                if attr_value != current_attr_value:
                    diff_for_key = diff.changed_configs.setdefault(area_ident, {})
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
        expected_diff.changed_configs = {
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
        expected_diff.changed_configs = {
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
        expected_diff.new_configs = ['3201']
        self.assertEqual(expected_diff, diff)
