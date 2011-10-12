# (c) Nelen & Schuurmans.  GPL licensed, see LICENSE.txt.
from django.http import HttpResponse

from lizard_portal.models import PortalConfiguration
    

def json_configuration(request, id):
    """
    Return JSON for request.
    """
    pc = PortalConfiguration.objects.get(pk=id)
    return HttpResponse(pc.configuration, mimetype="application/json")
    

