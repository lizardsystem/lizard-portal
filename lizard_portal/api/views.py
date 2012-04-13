#!/usr/bin/python
# -*- coding: utf-8 -*-

# pylint: disable=C0111

# Copyright (c) 2012 Nelen & Schuurmans.  GPL licensed, see LICENSE.rst.

import logging

from lizard_api.base import BaseApiView
from lizard_portal.models import ConfigurationToValidate
from lizard_security.models import DataSet

logger = logging.getLogger(__name__)


class ConfigurationToValidateView(BaseApiView):

    model_class = ConfigurationToValidate
    name_field = 'configuration'

    field_mapping = {
        'id': 'id',
        'polder': 'area__name',
        'type':   'config_type',
        'user':   'user',
        'date':   'date',
        'action': 'action'
        }

    read_only_fields = [
    ]

    def get_object_for_api(self,
                           config,
                           flat=True,
                           size=BaseApiView.COMPLETE,
                           include_geom=False):
        """
            create object of measure
        """

        output = {
            'id':     config.id,
            'polder': config.area.name,
            'type':   config.config_type,
            'user':   config.user,
            'date':   config.date,
            'action': self._get_choice(
                    ConfigurationToValidate._meta.get_field('action'),
                    config.action,
                    flat),
            }

        return output
