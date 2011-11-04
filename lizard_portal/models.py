# (c) Nelen & Schuurmans.  GPL licensed, see LICENSE.txt.
from django.db import models
import logging
#from datetime import datetime

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
