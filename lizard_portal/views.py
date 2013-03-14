# (c) Nelen & Schuurmans.  GPL licensed, see LICENSE.txt.

import os
import logging

from django import forms
from django.conf import settings

from django.http import HttpResponse
from django.shortcuts import redirect
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.template import TemplateDoesNotExist
from django.template import Template
from django.template.loader import get_template
from django.utils import simplejson
from django.views.decorators.csrf import csrf_exempt

from django.contrib.gis.geos import GEOSGeometry

from lizard_area.models import Area
from lizard_portal.configurations_retriever import ConfigurationsRetriever
from lizard_portal.configurations_retriever import\
    create_configurations_retriever
from lizard_portal.configurations_retriever import MockConfig
from lizard_portal.models import PortalConfiguration
from lizard_registration.models import SessionContextStore, UserContextStore
from lizard_registration.utils import auto_login
from lizard_registration.utils import get_user_permissions_overall
from lizard_registration.models import UserProfile
from lizard_task.models import SecuredPeriodicTask

logger = logging.getLogger(__name__)


def site(request, application_name, active_tab_name, only_portal=False):
    """
        returns html page which loads specified (ext-js) application
    """

    # Try to login based on ip range.
    if not request.user.is_authenticated():
        try:
            auto_login(request)
        except AttributeError:
            logger.exception('Could not auto_login')

    t = get_template('portal_pageframe.html')
    c = RequestContext(request, {
            'debug_mode': settings.DEBUG,
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
                context_store = user.sessioncontextstore_set.get(
                    session_key=session_key)
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

    try:
        extent_wgs = Area.objects.all().extent()
        wkt = 'LINESTRING(%f %f,%f %f)' % extent_wgs

        geom = GEOSGeometry(wkt, 4326)
        extent = geom.transform(900913, clone=True).extent
    except:
        #if getting extent failed (no areas or so) use default
        extent = (479517, 6799646, 584302, 7016613)

    t = get_template('application/' + application_name + '.js')
    c = RequestContext(request, {
            'application': application_name,
            'active_tab': active_tab_name,
            'context': context,
            'permission_list': perms_list,
            'perm': perms,
            'ftp_url': settings.FTP_URL,
            'extent': ','.join(['%.0f' % value for value in  extent])
        })

    return HttpResponse(t.render(c),
        mimetype='text/javascript')


def json_configuration(request):
    """
    Return JSON for request.
    """

    perms = dict(get_user_permissions_overall(
            request.user, 'user', as_list=True))
    c = RequestContext(request, {
        'perm': perms,
        'ftp_url': settings.FTP_URL
    })
    portal_template = request.GET.get('portal_template', 'homepage')

    if request.user.is_authenticated():
        if portal_template == 'maatregelen-beheer':
            return redirect('lizard_measure.measure_groupedit_portal')
        elif portal_template == 'organisatie-beheer':
            return redirect('lizard_measure.organization_groupedit_portal')
        elif portal_template == 'stuurparameter-overzicht':
            return redirect('lizard_measure.steerparameter_overview')
        #elif portal_template == 'area_link':
            # We need the template that couples KRW water bodies and catchment
            # areas which is only allowed if the user is an analyst. We cannot
            # easily detect that in the template itself so we do that here.
            #is_funct_beheerder = request.user.user_group_memberships.filter(
            #permission_mappers__permission_group__permissions__codename=
            #'is_funct_beheerder').exists()
            #if not is_funct_beheerder:
            #    t = get_template('portals/geen_toegang.js')
            #    return HttpResponse(t.render(c),  mimetype="text/plain")
        try:
            t = get_template('portals/' + portal_template + '.js')
        except TemplateDoesNotExist:
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

    content = resp.read()
    return HttpResponse(content,  mimetype="text/plain")


def validate(request):
    logger.debug('lizard_portal.views.validate')
    retriever = create_configurations_retriever()
    configurations = retriever.retrieve_configurations_as_dict()
    json = simplejson.dumps(
        {'data': configurations, 'count': len(configurations)})
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
        (lambda: [MockConfig(config) for config in configuration_list])
    return retriever


class UploadFileForm(forms.Form):
    file = forms.FileField(label="")


def organisation_mapping(organisation_name):
    """Map names of organisations with names of
    directories in vss-shared map."""
    mapping = {'waternet': 'Waternet',
               'rijnland': 'Rijnland',
               'hhnk': 'HHNK'}
    return mapping.get(organisation_name)


def handle_uploaded_file(f, organisation):
    """Copy file to configured destination directory."""
    if organisation == "":
        filepath = os.path.join(settings.VALIDATION_ROOT, f.name)
    else:
        filepath = os.path.join(settings.VALIDATION_ROOT,
                                organisation_mapping(organisation),
                                f.name)
    with open(filepath, 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)


def check_permission(user):
    """Return true is the user has permission
    is_analyst or superuser."""
    perms = dict(get_user_permissions_overall(user, 'user', as_list=True))
    if (('is_analyst' in perms) or user.is_superuser):
        return True
    return False


def run_prepare_configurations_as_task(user, organisation):
    """Run 'lizard_portal.tasks.prepare_configurations_as_task'."""
    if user.is_superuser:
        periodic_tasks = SecuredPeriodicTask.objects.filter(
            task='lizard_portal.tasks.prepare_configurations_as_task')
    else:
        periodic_tasks = SecuredPeriodicTask.objects.filter(
            data_set__name=organisation_mapping(organisation),
            task='lizard_portal.tasks.prepare_configurations_as_task')
    for periodic_task in periodic_tasks:
        periodic_task.send_task(username=user.username)


def get_organisation_name(user):
    """Retrieve organisation name for the user."""
    try:
        organisation = UserProfile.objects.get(
            user__username=user.username).organisation.name
        return organisation
    except:
        return ''


@csrf_exempt
def upload_file(request):
    form = None
    msg = ""
    user = request.user
    organisation = get_organisation_name(user)
    allowed = check_permission(user)
    if allowed:
        if request.method == 'POST':
            form = UploadFileForm(request.POST, request.FILES)
            if form.is_valid():
                f = request.FILES.get('file', None)
                handle_uploaded_file(f, organisation)
                run_prepare_configurations_as_task(
                    user, organisation)
                msg = "File '%s' is uploaded. %s %s %s." % (
                    f.name,
                    "Ga naar het scherm ",
                    "'Valideren waterbalans/ESF configuraties'",
                    "en stel de configuraties in")
        else:
            form = UploadFileForm()
            msg = "Kies een zip bestand met configuraties en klik op "\
                "upload button."
    else:
        msg = "Toegang is geweigerd, u bent geen lid van "\
            "'analist' gebruikersgroep."

    data = {'form': form, 'msg': msg, 'allowed': allowed}
    return render_to_response('lizard_portal/upload_file.html', data)
