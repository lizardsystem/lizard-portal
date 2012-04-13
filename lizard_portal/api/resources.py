from djangorestframework.resources import ModelResource

from lizard_portal.models import ConfigurationToValidate


class ConfigurationToValidateResource(ModelResource):

    model = ConfigurationToValidate
