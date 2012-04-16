# (c) Nelen & Schuurmans.  GPL licensed, see LICENSE.txt.

import os
import logging

from django.db import models
from django.utils.translation import ugettext as _

from lizard_area.models import Area
from lizard_security.models import DataSet
from lizard_security.manager import FilteredManager

logger = logging.getLogger(__name__)


class PortalConfiguration(models.Model):
    """
    Stores configurations for the Portal layouts.
    TODO: Expand with FK to Users?
    TODO: Add JSON validation?
    """
    name = models.CharField(blank=False, null=False, max_length=255)
    slug = models.SlugField(blank=False, unique=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    configuration = models.TextField(blank=False, default="{}")

    def __unicode__(self):
        return str(self.name)


class Database(object):
    """Provides a wrapper around the Django database."""

    @property
    def areas(self):
        return Area.objects

    @property
    def data_sets(self):
        return DataSet.objects


class ConfigurationToValidate(models.Model):

    class Meta:
        verbose_name = _('Configuration to validate')
        verbose_name_plural = _('Configurations to validate')
        ordering = ['data_set', 'area', 'config_type', ]

    KEEP = 0
    VALIDATE = 1

    ACTIONS = (
        (KEEP, _('Keep')),
        (VALIDATE, _('Validate')),
        )

    area = models.ForeignKey(Area, help_text='Link to the area')
    config_type = models.CharField(
        help_text='Type of the configuration',
        max_length=24)
    # allowed values for config_type are 'waterbalans', 'esf[n]' for n > 0
    user = models.CharField(
        help_text='User name supplied with the configuration',
        max_length=48)
    date = models.CharField(
        help_text='Date supplied with the configuration',
        max_length=48)
    fews_meta_info = models.CharField(
        help_text='Meta info supplied with the configuration',
        null=True, blank=True, max_length=256)
    file_path = models.CharField(
        help_text='Path to the directory that contains the configuration',
        max_length=256)
    action = models.IntegerField(
        help_text='Action to perform on the configuration',
        choices=ACTIONS, default=KEEP)
    action_log = models.CharField(
        help_text='Status of the last validation action',
        null=True, blank=True, max_length=256)

    supports_object_permissions = True
    data_set = models.ForeignKey(DataSet,
        help_text='Link to the water manager of the area',
        null=True, blank=True)
    objects = FilteredManager()

    def __init__(self, *args, **kwargs):
        models.Model.__init__(self, *args, **kwargs)
        self.db = Database()

    def set_attributes(self, attribute_dict):
        meta_info = ''
        for key, value in attribute_dict.items():
            if key == 'area_code':
                try:
                    self.area = self.db.areas.get(ident=value)
                except Area.DoesNotExist:
                    logger.warning("Unable to find the area with ident '%s'", value)
            elif key == 'data_set':
                try:
                    self.data_set = self.db.data_sets.get(name__iexact=value)
                except DataSet.DoesNotExist:
                    logger.warning("Unable to find the data set with name '%s'", value)
            elif key in ['file_path', 'config_type', 'date', 'user']:
                setattr(self, key, value)
            else:
                meta_info += '%s: %s; ' % (key, value)
        self.fews_meta_info = meta_info

    def as_dict(self):
        return {
            'polder': self.area.name,
            'type':   self.config_type,
            'user':   self.user,
            'date':   self.date,
            'action': self.get_action_display(),
            }

    @property
    def pumpingstations_dbf(self):
        """Create a filepath."""
        return os.path.join(self.file_path, 'pumpingstations.dbf')

    @property
    def grondwatergebieden_dbf(self):
        """Create a filepath."""
        return os.path.join(self.file_path, 'grondwatergebieden.dbf')

    @property
    def area_dbf(self):
        """Create a filepath for current configuration."""
        return os.path.join(
            self.file_path, 'aanafvoer_%s.dbf' % self.config_type)

    def __unicode__(self):
        return '%s %s %s' % (self.area, self.config_type, self.date)
