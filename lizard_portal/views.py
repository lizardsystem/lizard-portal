# (c) Nelen & Schuurmans.  GPL licensed, see LICENSE.txt.
from django.http import HttpResponse
from django.template import Context
from django.template import Template


from lizard_portal.models import PortalConfiguration
from lizard_area.models import Communique

def json_configuration(request, slug):
    """
    Return JSON for request.
    """
    communiques = Communique.objects.all()
    
    try:
        pc = PortalConfiguration.objects.filter(slug=slug)[0]
        t = Template(pc.configuration)
        c = Context({'communiques': communiques})
        
        configuration = t.render(c)
    except:
        return HttpResponse("{}", mimetype="application/json")
        
    return HttpResponse(configuration, mimetype="application/json")
    

