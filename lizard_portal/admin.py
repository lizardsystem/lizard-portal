from django.contrib import admin
from lizard_portal.models import PortalConfiguration

class PortalConfigurationAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {"slug": ("name",)}
    
admin.site.register(PortalConfiguration, PortalConfigurationAdmin)
