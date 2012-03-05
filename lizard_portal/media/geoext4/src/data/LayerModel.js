/**
 * Copyright (c) 2008-2010 The Open Source Geospatial Foundation
 *
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */

/** api: (define)
 *  module = GeoExt.data
 *  class = LayerRecord
 *  base_link = `Ext.data.Record <http://dev.sencha.com/deploy/dev/docs/?class=Ext.data.Record>`_
 */
//Ext.namespace("GeoExt.data");

/** api: constructor
 *  .. class:: LayerRecord
 *
 *      A record that represents an ``OpenLayers.Layer``. This record
 *      will always have at least the following fields:
 *
 *      * title ``String``
 */
Ext.define('GeoExt.data.LayerModel', {
	extend : 'Ext.data.Model',
	idProperty : "name",
	fields : [{
		name : "layer"
	}, {
		name : "title",
		type : "string",
		mapping : "name"
	},{
		name : "visibility",
		type : "boolean",
		mapping : "visibility"
	},{
		name : "isbaselayer",
		type : "boolean",
        defaultValue: false,
		mapping : "isbaselayer"
	}],
	getLayer : function() {
		return this.get("layer");
	},
	setLayer : function(layer) {
        this.set("layer", layer);
		return;
		//orgineel
		var me = this;
		if(layer !== me.getLayer) {
			me.dirty = true;
			if(!me.modified) {
				me.modified = {};
			}
			if(me.modified.layer === undefined) {
				me.modified.layer = me.data.layer;
			}
			me.data.layer = layer;
			if(!me.editing) {
				me.afterEdit();
			}
		}
	},
	copy : function(id) {
		var layer = this.getLayer() && this.getLayer().clone();
		return new this.constructor(Ext.applyIf({
			layer : layer
		}, this.data), id || layer.id);
	}
});
