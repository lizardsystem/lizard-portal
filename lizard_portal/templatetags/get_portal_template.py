from django.template import Library, Node
from lizard_portal.models import PortalConfiguration

register = Library()


class PortalTemplate(Node):
    def __init__(self, template_slug):
        self.template_slug = template_slug

    def render(self, context):
        slug = self.template_slug
        return PortalConfiguration.objects.get(slug=slug).configuration

#@register.filter
def get_portal_template(parser, token):
    bits = token.contents.split()

    return PortalTemplate(bits[1])

get_portal_template = register.tag('get_portal_template', get_portal_template)

