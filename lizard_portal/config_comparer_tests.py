#!/usr/bin/python
# -*- coding: utf-8 -*-

# pylint: disable=C0111

# Copyright (c) 2012 Nelen & Schuurmans.  GPL licensed, see LICENSE.rst.

from unittest import TestCase

from lizard_portal.configurations_retriever import ConfigurationToValidate


class ConfigComparer(object):

    def compare(self, config):
        candidate = self.get_candidate_config_as_dict(self, config)
        current = self.get_current_config_as_dict(self, config)

        diff = {}
        for key, record in candidate.items():
            current_record = current[key]
            for attr_name, attr_value in record.items():
                if attr_value != current_record[attr_name]:
                    diff_for_key = diff.setdefault(key, {})
                    diff_for_key[attr_name] = (attr_value, current_record[attr_name])
        return diff

    def get_candidate_config_as_dict(self, config):
        pass

    def get_current_config_as_dict(self, config):
        pass

class ConfigComparerTestSuite(TestCase):

    def test_a(self):
        """Test a difference of a single field.

        The field is present in both configurations but with different values.

        """
        config = ConfigurationToValidate()
        comparer = ConfigComparer()

        candidate_config = { '3201': { 'DIEPTE': '1.17' } }
        current_config = { '3201' : { 'DIEPTE': '1.18' } }
        comparer.get_candidate_config_as_dict = lambda s, c: candidate_config
        comparer.get_current_config_as_dict = lambda s, c: current_config

        diff = comparer.compare(config)
        expected_diff = {
            '3201': {
                'DIEPTE': ('1.17', '1.18'),
                }
            }
        self.assertEqual(expected_diff, diff)
