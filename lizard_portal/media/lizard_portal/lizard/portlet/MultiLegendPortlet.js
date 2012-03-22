(function() {

  Ext.define('Lizard.portlet.MultiLegendPortlet', {
    extend: 'Lizard.portlet.MultiImagePortlet',
    alias: 'widget.multilegendportlet',
    getGraphButtonConfig: function() {
      return [];
    },
    calcHeights: function(new_width, new_height, new_fit) {
      var display_item, height, width, _i, _len, _ref, _results;
      if (new_width == null) new_width = null;
      if (new_height == null) new_height = null;
      if (new_fit == null) new_fit = null;
      width = new_width || 238;
      height = new_width || this.body.getSize().height - 20;
      _ref = this.store.data.items;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        display_item = _ref[_i];
        display_item.beginEdit();
        display_item.set('height', height);
        display_item.set('width', width);
        _results.push(display_item.endEdit());
      }
      return _results;
    }
  });

}).call(this);
