# (c) Nelen & Schuurmans.  GPL licensed, see LICENSE.txt.
from django.http import HttpResponse

from lizard_portal.models import PortalConfiguration
    

def json_configuration(request, slug):
    """
    Return JSON for request.
    """
    pc = PortalConfiguration.objects.filter(slug=slug)[0]
    return HttpResponse(pc.configuration, mimetype="application/json")
    

