#!/usr/bin/python
# -*- coding: utf-8 -*-

# pylint: disable=C0111

# Copyright (c) 2012 Nelen & Schuurmans.  GPL licensed, see LICENSE.rst.

import logging

from celery.task import task

from lizard_portal.configurations_retriever import ConfigurationStore
from lizard_task.task import task_logging


def prepare_configurations():
    """Prepare the configurations for validation.

    This method creates a ConfigurationToValidate for configurations that are
    specified by a set of zip files. Furthermore, it unzips these files to a
    predefined directory. For details, please see the source code of
    ConfigurationStore.

    """
    ConfigurationStore().supply()

@task()
@task_logging
def prepare_configurations_as_task(taskname, levelno=20, username=None):
    """Prepare the configurations for validation.

    This task has the same functionality as function ``prepare_configurations``
    """
    logger = logging.getLogger(taskname)

    logger.info('Start the preparations of configurations')

    config_store = ConfigurationStore()
    config_store.logger = logger
    config_store.supply()

    logger.info('END PREPARATION')
