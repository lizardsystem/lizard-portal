from django.contrib import admin
from lizard_portal.models import PortalConfiguration

class PortalConfigurationAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}
    
admin.site.register(PortalConfiguration, PortalConfigurationAdmin)
