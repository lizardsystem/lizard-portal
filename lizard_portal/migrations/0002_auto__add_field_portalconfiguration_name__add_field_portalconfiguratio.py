# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Adding field 'PortalConfiguration.name'
        db.add_column('lizard_portal_portalconfiguration', 'name', self.gf('django.db.models.fields.CharField')(max_length=255), keep_default=False)

        # Adding field 'PortalConfiguration.slug'
        db.add_column('lizard_portal_portalconfiguration', 'slug', self.gf('django.db.models.fields.SlugField')(max_length=50, db_index=True), keep_default=False)


    def backwards(self, orm):
        
        # Deleting field 'PortalConfiguration.name'
        db.delete_column('lizard_portal_portalconfiguration', 'name')

        # Deleting field 'PortalConfiguration.slug'
        db.delete_column('lizard_portal_portalconfiguration', 'slug')


    models = {
        'lizard_portal.portalconfiguration': {
            'Meta': {'object_name': 'PortalConfiguration'},
            'configuration': ('django.db.models.fields.TextField', [], {'default': "'{}'"}),
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'modified': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'slug': ('django.db.models.fields.SlugField', [], {'max_length': '50', 'db_index': 'True'})
        }
    }

    complete_apps = ['lizard_portal']
