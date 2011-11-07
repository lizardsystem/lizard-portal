# (c) Nelen & Schuurmans.  GPL licensed, see LICENSE.txt.
from django.http import HttpResponse
from django.template import Context
from django.template import Template
from django.template.loader import get_template

from lizard_portal.models import PortalConfiguration
from lizard_area.models import Area


def json_configuration(request):
    """
    Return JSON for request.
    """
    object_id = request.GET.get('object_id', None)
    object = request.GET.get('object', None)

    if object == 'aan-afvoergebied' and object_id:
        c = Context({'bla': 'bla',
                    'area': Area.objects.get(ident=area_id)})
    else:
        c = Context()

    portal_template = request.GET.get('portalTemplate', 'homepage')
    if portal_template == 'homepage':
        t = get_template('portals/homepage.js')
    elif portal_template == 'esf-1':
        t = get_template('portals/esf-1.js')
    elif portal_template == 'esf-overzicht':
        t = get_template('portals/esf-overzicht.js')
    elif portal_template == 'communique':
        t = get_template('portals/communique.js')
    elif portal_template == 'analyse-interpretatie-details':
        t = get_template('portals/analyse-interpretatie-details.js')
    elif portal_template == 'analyse-interpretatie':
        t = get_template('portals/analyse-interpretatie.js')
    elif portal_template == 'waterbalans':
        t = get_template('portals/waterbalans.js')
    elif portal_template == 'waterbalans-configuratie':
        t = get_template('portals/waterbalans-configuratie.js')
    elif portal_template == 'aan_afvoergebied_selectie':
        t = get_template('portals/aan_afvoergebied_selectie.js')
    elif portal_template == 'krw_selectie':
        t = get_template('portals/krw_selectie.js')
    elif portal_template == 'krw-overzicht':
        t = get_template('portals/krw-overzicht.js')
    elif portal_template == 'eigenschappen':
        t = get_template('portals/eigenschappen.html')
    else:
        pc = PortalConfiguration.objects.filter(slug=portal_template)[0]
        t = Template(pc.configuration)
    return HttpResponse(t.render(c),  mimetype="text/plain")


def feature_info(request):
    """
    Return JSON for request.
    """
    url = request.GET.get('request', None)

    import httplib

    print url

    urls = url.strip('"').strip("'").strip('http://')

    split = urls.find('/')


    conn = httplib.HTTPConnection(urls[:split])
    conn.request('GET', urls[split:])
    resp = conn.getresponse()

    print resp.status
    content =  resp.read()
    print content
    return HttpResponse(content,  mimetype="text/plain")
