from django.template import Library, Node
from lizard_portal.models import PortalConfiguration

register = Library()


class PortalTemplate(Node):
    def __init__(self, template_slug):
        self.template_slug = template_slug

    #for the time being (testing), we get the code from a portal Configuration Object
    def render(self, context):
        slug = self.template_slug
        return PortalConfiguration.objects.get(slug=slug).configuration

#@register.filter
def get_grid(parser, token):
    bits = token.contents.split()

    return PortalTemplate(bits[1])

get_portal_template = register.tag('get_grid', get_grid)