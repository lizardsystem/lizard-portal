(function() {

  Ext.define('Lizard.model.Graph', {
    extend: 'Ext.data.Model',
    fields: [
      {
        name: 'id',
        mapping: 'id',
        type: 'text'
      }, {
        name: 'order',
        mapping: 'order',
        type: 'int',
        defaultValue: 10
      }, {
        name: 'name',
        mapping: 'name',
        type: 'text'
      }, {
        name: 'group',
        mapping: 'group',
        type: 'text'
      }, {
        name: 'visible',
        mapping: 'visible',
        type: 'boolean'
      }, {
        name: 'base_url',
        mapping: 'base_url',
        type: 'text'
      }, {
        name: 'predefined_graph',
        mapping: 'predefined_graph',
        type: 'text'
      }, {
        name: 'use_context_location',
        mapping: 'use_context_location',
        type: 'text'
      }, {
        name: 'location',
        mapping: 'location',
        type: 'text'
      }, {
        name: 'width',
        mapping: 'width',
        defaultValue: 1000,
        type: 'int'
      }, {
        name: 'height',
        mapping: 'height',
        defaultValue: 300,
        type: 'int'
      }, {
        name: 'extra_params',
        mapping: 'extra_params'
      }, {
        name: 'has_reset_period',
        mapping: 'has_reset_period',
        type: 'boolean'
      }, {
        name: 'reset_period',
        mapping: 'reset_period',
        type: 'text'
      }, {
        name: 'has_cumulative_period',
        mapping: 'has_cumulative_period',
        type: 'boolean'
      }, {
        name: 'cumulative_period',
        mapping: 'cumulative_period',
        type: 'text'
      }, {
        name: 'extra_ts',
        mapping: 'extra_ts'
      }, {
        name: 'dt_end'
      }, {
        name: 'dt_start'
      }, {
        name: 'orig_height',
        convert: function(v, rec) {
          return rec.height || 300;
        }
      }, {
        name: 'add_download_link',
        mapping: 'add_download_link',
        type: 'boolean'
      }, {
        name: 'detail_link',
        mapping: 'detail_link',
        type: 'text'
      }
    ],
    statics: {
      getGraphUrl: function(values, without_height_width) {
        var base_url, params, querystring;
        if (without_height_width == null) without_height_width = false;
        base_url = values['base_url'];
        params = {
          dt_start: values.dt_start,
          dt_end: values.dt_end
        };
        if (values['location']) params.location = values['location'];
        if (values['predefined_graph']) params.graph = values['predefined_graph'];
        if (values['use_context_location']) params.location = values['location'];
        if (values['has_reset_period'] && values['reset_period']) {
          params['reset-period'] = values['reset_period'];
        }
        if (values['has_cumulative_period'] && values['cumulative_period']) {
          params['aggregation-period'] = values['cumulative_period'];
        }
        if (values['extra_params']) {
          Ext.Object.each(values['extra_params'], function(key, value) {
            return params[key] = value;
          });
        }
        if (!without_height_width) {
          params.height = values['height'];
          params.width = values['width'];
        }
        querystring = Ext.Object.toQueryString(params);
        return Ext.String.urlAppend(base_url, querystring);
      },
      getDownloadUrl: function(values) {
        var url;
        url = this.getGraphUrl(values);
        return url += '&format=csv';
      }
    }
  });

}).call(this);
