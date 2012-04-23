
Ext.define('Lizard.model.Graph', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            mapping: 'id',
            type: 'text'
        },{
            name: 'order',
            mapping: 'order',
            type: 'int',
            defaultValue:10
        },{
            name: 'name',
            mapping: 'name',
            type: 'text'
        },{
            name: 'group',
            mapping: 'group',
            type: 'text'
        },{
            name: 'visible',
            mapping: 'visible',
            type: 'boolean'
        },{
            name: 'base_url',
            mapping: 'base_url',
            type: 'text'
        },{
            name: 'predefined_graph',
            mapping: 'predefined_graph',
            type: 'text'
        },{
            name: 'use_context_location',
            mapping: 'use_context_location',
            type: 'text'
        },{
            name: 'location',
            mapping: 'location',
            type: 'text'
        },{
            name: 'width',
            mapping: 'width',
            defaultValue: 1000,
            type: 'int'
        },{
            name: 'height',
            mapping: 'height',
            defaultValue: 300,
            type: 'int'
        }, {
            name: 'extra_params',
            mapping: 'extra_params',
            #object
        },{
            name: 'has_reset_period',
            mapping: 'has_reset_period',
            type: 'boolean'
        },{
            name: 'reset_period',
            mapping: 'reset_period',
            type: 'text'
        },{
            name: 'has_cumulative_period',
            mapping: 'has_cumulative_period',
            type: 'boolean'
        },{
            name: 'cumulative_period',
            mapping: 'cumulative_period',
            type: 'text'
        },{#todo, not implemented yet
            name: 'extra_ts',
            mapping: 'extra_ts'
            #object
        },{
            name: 'dt_end',
        },{
            name: 'dt_start',
        },{
            name: 'orig_height',
            convert: (v, rec) ->

                return rec.height || 300
        },{
            name: 'add_download_link',
            mapping: 'add_download_link',
            type: 'boolean'
        },{
            name: 'detail_link',
            mapping: 'detail_link',
            type: 'text'
        },{
            name: 'legend_location',
            mapping: 'legend_location',
            type: 'int'
        }
    ],


    statics:
        getGraphUrl: (values, without_height_width=false) ->
            base_url = values['base_url']

            params = {
                dt_start: values.dt_start
                dt_end: values.dt_end
            }

            if values['location']
                params.location = values['location']

            if values['predefined_graph']
                params.graph = values['predefined_graph']
            if values['use_context_location']
               params.location = values['location']
            if values['has_reset_period'] and values['reset_period']
                params['reset-period'] = values['reset_period']
            if values['has_cumulative_period'] and values['cumulative_period']
                params['aggregation-period'] =  values['cumulative_period']
            if values['legend_location']
                params['legend-location'] = values['legend_location']

            if values['extra_params']
                Ext.Object.each(
                    values['extra_params'],
                    (key,value) ->
                        params[key] = value
                )

            if not without_height_width
                params.height = values['height']
                params.width = values['width']

            querystring = Ext.Object.toQueryString(params)

            return Ext.String.urlAppend(base_url, querystring)

        getDownloadUrl: (values) ->
            url = @getGraphUrl(values)
            url += '&format=csv'

});
