# (c) Nelen & Schuurmans.  GPL licensed, see LICENSE.txt.
import json
from django.http import HttpResponse
from django.shortcuts import redirect
from django.template import RequestContext
from django.template import TemplateDoesNotExist
from django.template import Template
from django.template.loader import get_template
from lizard_registration.models import SessionContextStore, UserContextStore

from lizard_registration.utils import auto_login

from lizard_portal.models import PortalConfiguration

from lizard_registration.utils import get_user_permissions_overall

def site(request, application_name, active_tab_name, only_portal=False):
    """
        returns html page which loads specified (ext-js) application
    """
    if not request.user.is_authenticated():
        auto_login(request)

    app_javascript_file = get_template('application/'+application_name+'.js')
    #django.template.TemplateDoesNotExist
    t = get_template('portal_pageframe.html')
    c = RequestContext(request, {
            'application': application_name,
            'active_tab': active_tab_name,
            'only_portal': only_portal
        })

    return HttpResponse(t.render(c),
        mimetype='text/html')


def application(request, application_name, active_tab_name):
    """
        returns html page which loads specified (ext-js) application
    """
    context = '{}'
    user = request.user

    if user.iprangelogin_set.all().count() > 0:
        session_key = request.session.session_key
        try:
            context_store = user.sessioncontextstore.get(session_key=session_key)
            context = context_store.context
        except SessionContextStore.DoesNotExist:
            successful = False
    else:
        try:
            context = user.usercontextstore.context
        except UserContextStore.DoesNotExist:
            successful = False

    perms_list = get_user_permissions_overall(user, 'user')

    perms = dict(get_user_permissions_overall(user, 'user', as_list=True))

    t = get_template('application/'+application_name+'.js')
    c = RequestContext(request, {
            'application': application_name,
            'active_tab': active_tab_name,
            'context': context,
            'permission_list': perms_list,
            'perms': perms
        })

    return HttpResponse(t.render(c),
        mimetype='text/javascript')


def json_configuration(request):
    """
    Return JSON for request.
    """
    c = RequestContext(request)

    portal_template = request.GET.get('portal_template', 'homepage')

    if request.user.is_authenticated():

        if portal_template == 'maatregelen-beheer':
            return redirect('lizard_measure.measure_groupedit_portal')
        elif portal_template == 'organisatie-beheer':
            return redirect('lizard_measure.organization_groupedit_portal')

        try:
            t = get_template('portals/'+portal_template+'.js')
        except TemplateDoesNotExist, e:
            pc = PortalConfiguration.objects.filter(slug=portal_template)[0]
            t = Template(pc.configuration)
    else:
        t = get_template('portals/geen_toegang.js')

    return HttpResponse(t.render(c),  mimetype="text/plain")


def feature_info(request):
    """
    Return JSON for request.
    """
    url = request.GET.get('request', None)

    import httplib

    urls = url.strip('"').strip("'").strip('http://')

    split = urls.find('/')


    conn = httplib.HTTPConnection(urls[:split])
    conn.request('GET', urls[split:])
    resp = conn.getresponse()

    content =  resp.read()
    return HttpResponse(content,  mimetype="text/plain")
