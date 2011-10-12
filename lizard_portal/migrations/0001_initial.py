# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Adding model 'PortalConfiguration'
        db.create_table('lizard_portal_portalconfiguration', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('created', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('modified', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, blank=True)),
            ('configuration', self.gf('django.db.models.fields.TextField')(default='{}')),
        ))
        db.send_create_signal('lizard_portal', ['PortalConfiguration'])


    def backwards(self, orm):
        
        # Deleting model 'PortalConfiguration'
        db.delete_table('lizard_portal_portalconfiguration')


    models = {
        'lizard_portal.portalconfiguration': {
            'Meta': {'object_name': 'PortalConfiguration'},
            'configuration': ('django.db.models.fields.TextField', [], {'default': "'{}'"}),
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'modified': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'})
        }
    }

    complete_apps = ['lizard_portal']
