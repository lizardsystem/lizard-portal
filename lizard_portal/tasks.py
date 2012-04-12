#!/usr/bin/python
# -*- coding: utf-8 -*-

# pylint: disable=C0111

# Copyright (c) 2012 Nelen & Schuurmans.  GPL licensed, see LICENSE.rst.

from lizard_portal.configurations_retriever import ConfigurationStore

@task()
def prepare_configurations():
    """Prepare the configurations for validation.

    This task creates a ConfigurationToValidate for configurations that are
    specified by a set of zip files. Furthermore, it unzips these files to a
    predefined directory. For details, please see the source code of
    ConfigurationStore.

    """
    ConfigurationStore().supply()
