#!/usr/bin/python
# -*- coding: utf-8 -*-

# pylint: disable=C0111

# Copyright (c) 2012 Nelen & Schuurmans.  GPL licensed, see LICENSE.rst.

from unittest import TestCase

from lizard_portal.configurations_retriever import ConfigurationsRetriever
from lizard_portal.configurations_retriever import MockConfig


class ConfigurationsRetrieverTestSuite(TestCase):

    def test_a(self):
        """Test the right configurations are retrieved."""
        retriever = ConfigurationsRetriever()
        configuration_list = ['config A', 'config B']
        retriever.retrieve_configurations = \
            (lambda : [MockConfig(config) for config in configuration_list])
        self.assertEqual(configuration_list, retriever.retrieve_as_list())

    # def test_b(self):
    #     """Test no configurations are retrieved when there are no zip files."""
    #     retriever = ConfigurationsRetriever()
    #     retriever.retrieve_zip_files = (lambda s: [])
    #     self.assertEqual([], retriever.retrieve_as_list())
