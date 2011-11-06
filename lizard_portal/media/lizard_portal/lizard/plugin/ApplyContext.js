Ext.define('Lizard.plugin.ApplyContext', {
    alias: 'plugin.applycontext',

    register_event_parent: function(object_self, eventname, event_function, max_levels_deep) {
        var max_levels_deep = max_levels_deep || 10;
        var parent = object_self.ownerCt;
        for (var i = 0; i < max_levels_deep; i++) {
            if (parent.events[eventname]) {
                parent.on(eventname, event_function, object_self);
                return true;
            } else {
                parent = parent.ownerCt
            }
        }
        return false;
    },

    /**
     * Called by plug-in system to initialize the plugin for a specific class
     */
    init: function(obj) {
        var me = this

        if (!obj.applyParams) {
            obj.applyParams = function(params) {
                console.log('add applyParams to function for '+ this.id);
                console.log(params);
            }
        }

        obj.on('beforerender', function(event){
               success = me.register_event_parent(this, 'contextchange', this.applyParams);
               console.log('status event registration: '+ success);

            }, obj);

    }
});