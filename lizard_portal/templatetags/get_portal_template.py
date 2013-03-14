from django.template import Library, Node
from django.template import Template
from django.template.loader import get_template
from django.template import TemplateDoesNotExist

from lizard_portal.models import PortalConfiguration
register = Library()


class PortalTemplate(Node):
    '''
        give part saved as seperate template in portals map or database

    '''
    def __init__(self, template_slug):
        self.template_slug = template_slug

    def render(self, context):
        slug = self.template_slug
        try:
            t = get_template('portals/' + slug + '.js')
        except TemplateDoesNotExist:
            pc = PortalConfiguration.objects.filter(slug=slug)[0]
            t = Template(pc.configuration)
        return t.render(context)


#@register.filter
def get_portal_template(parser, token):
    bits = token.contents.split()

    return PortalTemplate(bits[1])

get_portal_template = register.tag('get_portal_template', get_portal_template)
