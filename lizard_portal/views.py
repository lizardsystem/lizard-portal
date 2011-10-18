# (c) Nelen & Schuurmans.  GPL licensed, see LICENSE.txt.
from django.http import HttpResponse
from django.template import Context
from django.template import Template


from lizard_portal.models import PortalConfiguration
from lizard_area.models import Communique

def json_configuration(request):
    """
    Return JSON for request.
    """
    communiques = Communique.objects.all()
    
    portal_template = request.GET.get('portalTemplate', 'homepage')
    pc = PortalConfiguration.objects.filter(slug=portal_template)[0]
    return HttpResponse(pc.configuration, mimetype="application/json")
