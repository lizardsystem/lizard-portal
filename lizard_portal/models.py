# (c) Nelen & Schuurmans.  GPL licensed, see LICENSE.txt.

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
    user_name = models.CharField(
        help_text='User name supplied with the configuration',
        max_length= 48)
    date = models.CharField(
        help_text='Date supplied with the configuration',
        max_length=48)
    fews_meta_info = models.CharField(
        help_text='Meta info supplied with the configuration',
        max_length=256)
    file_path = models.CharField(
        help_text='Path to the file that contains the configuration',
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

    def __unicode__(self):
        return '%s %s %s' % (self.area, self.config_type, self.date)
