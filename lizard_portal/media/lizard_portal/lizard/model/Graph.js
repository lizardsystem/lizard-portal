(function() {
  Ext.define('Lizard.model.Graph', {
    extend: 'Ext.data.Model',
    fields: [
      {
        name: 'id',
        mapping: 'id',
        type: 'text'
      }, {
        name: 'name',
        mapping: 'name',
        type: 'text'
      }, {
        name: 'url',
        mapping: 'url',
        type: 'text'
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
        name: 'graph',
        mapping: 'graph',
        type: 'text'
      }, {
        name: 'extra_ts',
        mapping: 'extra_ts'
      }
    ]
  });
  ({
    dt_start: Ext.Date.format(new_context.period_start, 'Y-m-d H:i:s'),
    dt_end: Ext.Date.format(new_context.period_end, 'Y-m-d H:i:s'),
    location: new_context.object_id
  });
}).call(this);
