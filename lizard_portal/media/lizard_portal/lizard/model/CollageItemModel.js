(function() {

  Ext.define('Lizard.model.CollageItemModel', {
    extend: 'Lizard.model.WorkspaceItemModel',
    fields: [
      {
        name: "name",
        type: "string"
      }, {
        name: "identifier",
        type: "string"
      }, {
        name: "grouping_hint",
        type: "string"
      }, {
        name: "plid",
        type: "integer"
      }, {
        name: "use_location_filter",
        type: "boolean",
        persist: false
      }, {
        name: "location_filter",
        type: "string",
        persist: false
      }, {
        name: "ollayer_class",
        type: "string",
        persist: false
      }, {
        name: "title",
        type: "string",
        persist: false
      }, {
        name: "layers",
        type: "string",
        persist: false
      }, {
        name: "filter",
        type: "string",
        persist: false
      }, {
        name: "request_params",
        type: "string",
        persist: false
      }, {
        name: "is_base_layer",
        type: "boolean",
        persist: false
      }, {
        name: "single_tile",
        type: "boolean",
        persist: false
      }, {
        name: "options",
        type: "string",
        persist: false
      }, {
        name: "is_local_server",
        type: "boolean",
        persist: false
      }, {
        name: "is_clickable",
        type: "boolean",
        persist: false
      }, {
        name: "js_popup_class",
        type: "string",
        persist: false
      }
    ]
  });

}).call(this);
