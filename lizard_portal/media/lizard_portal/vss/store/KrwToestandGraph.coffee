Ext.define('Vss.store.KrwToestandGraph', {
    extend: 'Lizard.store.Graph',
    model: 'Lizard.model.Graph'
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    },
    data: [{

        id:1,
        name: 'test1',
        visible: 'true',
        base_url: '/graph/?'
        use_context_location: true,
        location: null,
        graph: 'extinctie',
        width: null,
        height: null,

        extra_params: {},
        has_reset_period: false,
        reset_period: false,
        has_cumulative_period: false,
        cumulative_period: false,
        extra_ts: null

    },
    {
        id:2,
        name: 'test2',
        visible: 'false',
        base_url: '/graph/'
        use_context_location: true,
        location: null,
        graph: 'extinctie',
        width: null,
        height: null,
        extra_params: {},
        has_reset_period: false,
        reset_period: false,
        has_cumulative_period: false,
        cumulative_period: false,
        extra_ts: null

    },{
        id:3,
        name: 'test3',
        visible: true,
        base_url: '/graph/'
        use_context_location: true,
        location: null,
        graph: 'extinctie',
        width: null,
        height: null,
        extra_params: {},
        has_reset_period: true,
        reset_period: 'quarter',
        has_cumulative_period: false,
        cumulative_period: false,
        extra_ts: null

    },{
        id:4,
        name: 'test4',
        visible: true,
        base_url: '/graph/?',
        use_context_location: true,
        location: null,
        graph: 'extinctie',
        width: null,
        height: null,
        extra_params: {},
        has_reset_period: true,
        reset_period: 'month',
        has_cumulative_period: true,
        cumulative_period: 'month',
        extra_ts: null

    }
    ]
})