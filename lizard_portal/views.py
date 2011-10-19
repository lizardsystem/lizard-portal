# (c) Nelen & Schuurmans.  GPL licensed, see LICENSE.txt.
from django.http import HttpResponse
from django.template import Context
from django.template import Template
from django.template.loader import get_template


from lizard_portal.models import PortalConfiguration
from lizard_area.models import Communique

def json_configuration(request):
    """
    Return JSON for request.
    """
    communiques = Communique.objects.all()

    c = Context({'bla': 'bla'})
    
    portal_template = request.GET.get('portalTemplate', 'homepage')
    if portal_template == 'homepage':
        t = get_template('portals/homepage.js')
    elif portal_template == 'esf-1':
        t = get_template('portals/esf-1.js')
    elif portal_template == 'analyse-interpretatie':
        t = get_template('portals/analyse-interpretatie.js')
    else:
        pc = PortalConfiguration.objects.filter(slug=portal_template)[0]
        t = Template(pc.configuration)
    return HttpResponse(t.render(c),  mimetype="application/json")
