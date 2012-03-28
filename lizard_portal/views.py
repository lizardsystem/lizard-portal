# (c) Nelen & Schuurmans.  GPL licensed, see LICENSE.txt.

import logging

from django.http import HttpResponse
from django.shortcuts import redirect
from django.template import RequestContext
from django.template import TemplateDoesNotExist
from django.template import Template
from django.template.loader import get_template
from django.utils import simplejson

from lizard_portal.configurations_retriever import ConfigurationsRetriever
from lizard_portal.configurations_retriever import create_configurations_retriever
from lizard_portal.configurations_retriever import MockConfig
from lizard_portal.models import PortalConfiguration

from lizard_registration.models import SessionContextStore, UserContextStore
from lizard_registration.utils import auto_login
from lizard_registration.utils import get_user_permissions_overall

logger = logging.getLogger(__name__)

def site(request, application_name, active_tab_name, only_portal=False):
    """
        returns html page which loads specified (ext-js) application
    """

    # Why is this? It doesn't work?
    if not request.user.is_authenticated():
        auto_login(request)

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

    if user.is_authenticated():
        if user.iprangelogin_set.all().count() > 0:
            session_key = request.session.session_key
            try:
                context_store = user.sessioncontextstore_set.get(session_key=session_key)
                context = context_store.context
            except SessionContextStore.DoesNotExist:
                pass
        else:
            try:
                context = user.usercontextstore.context
            except UserContextStore.DoesNotExist:
                pass

        perms_list = get_user_permissions_overall(user, 'user')

        perms = dict(get_user_permissions_overall(user, 'user', as_list=True))
    else:
        perms = {}
        perms_list = []

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
        elif portal_template == 'stuurparameter-overzicht':
            return redirect('lizard_measure.steerparameter_overview')

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


def validate(request):
    logger.debug('lizard_portal.views.validate')
    retriever = local_create_configurations_retriever()
    configurations = retriever.retrieve_configurations_as_dict()
    json = simplejson.dumps({'data': configurations, 'count': len(configurations)})
    return HttpResponse(json)


def local_create_configurations_retriever():
    file_name_retriever = None
    configuration_factory = None
    retriever = \
        ConfigurationsRetriever(file_name_retriever, configuration_factory)
    configuration_list = [
        {'polder': 'Atekpolder',
         'type':   'waterbalans',
         'user':   'Analist John',
         'date':   '1-02-2012 11:00',
         'action': 'Bewaren'},
        {'polder': 'Atekpolder',
         'type':   'ESF_1',
         'user':   'Analist John',
         'date':   '1-02-2012 11:00',
         'action': 'Bewaren'},
        {'polder': 'Aetsveldsepolder Oost',
         'type':   'ESF_2',
         'user':   'Analist Jojanneke',
         'date':   '1-02-2012 11:00',
         'action': 'Bewaren'},
        {'polder': 'Aetsveldsepolder Oost',
         'type':   'waterbalans',
         'user':   'Analist Pieter',
         'date':   '1-02-2012 11:00',
         'action': 'Bewaren'}
        ]
    retriever.retrieve_configurations = \
        (lambda : [MockConfig(config) for config in configuration_list])
    return retriever
