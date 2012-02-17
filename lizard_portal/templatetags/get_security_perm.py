from django.template import Library, Node
from django.template import Template
from django.template.loader import get_template
from django.template import TemplateDoesNotExist

from lizard_portal.models import PortalConfiguration
register = Library()


class SecurityPermission(Node):
    '''
        check security, specially for lizard_security

    '''
    def __init__(self, permission):
        self.permission = permission

    def render(self, context):
        user = context.get('user')
        permission = self.permission
        a = a
        if user.has_perm(self.permission):
            return True

        if user.user_group_memberships.filter(
            permission_mappers__permission_group__permissions__codename = self.permission).exists():
            return True
        else:
            return False




#@register.tag
def is_analist(parser, token):
    a = a
    return SecurityPermission('is_analyst')

#@register.tag
def is_beleidsmedewerker(parser, token):
    return SecurityPermission('is_beleidsmaker')

#@register.tag
def is_helpdeskmedewerker(parser, token):
    return SecurityPermission('is_helpdesk_medewerker')

is_analist = register.tag('is_analist', is_analist)

is_beleidsmedewerker = register.tag('is_beleidsmedewerker', is_beleidsmedewerker)

is_helpdeskmedewerker = register.tag('is_helpdeskmedewerker', is_helpdeskmedewerker)