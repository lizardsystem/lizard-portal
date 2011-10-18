# (c) Nelen & Schuurmans.  GPL licensed, see LICENSE.txt.
from django.http import HttpResponse

from lizard_portal.models import PortalConfiguration
    

def json_configuration(request):
    """
    Return JSON for request.
    """
    portal_template = request.GET.get('portalTemplate', 'homepage')
    pc = PortalConfiguration.objects.filter(slug=portal_template)[0]
    return HttpResponse(pc.configuration, mimetype="application/json")
    

