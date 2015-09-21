"use strict";

SirTrevor.Blocks.Widget = SirTrevor.Block.extend({

  type: "widget",
  title: "Widget",
  icon_name: "image",

  pastable: true,

  paste_options: {
    html: [
    		'<div style="text-align: center;  padding:20px;">',
    		'  <span>Paste your external widget html here</span>',
    		'  <textarea class="st-paste-block" style="width: 100%; padding: 0.6em; border: 1px solid #D4D4D4;"  placeholder="Paste your code here"></textarea>',
    		'</div>',
    	].join('\n')
  },

  _serializeData: function() {
  	return {
  		code: this.$el.find('textarea').val()
  	}
  },

  loadData: function(data) {
  	this.loadPastedContent(data.code);
  },

  onContentPasted: function(ev) {
  	this.loadPastedContent($(ev.target).val());
  },

  loadPastedContent: function(code) {
  	code = code.replace(/</g, '&lt;');
  	code = code.replace(/>/g, '&gt;');
  	var codeTag = $('<pre>');
  	codeTag.html(code);

  	this.$editor.html(codeTag[0].outerHTML);
  	this.$inputs.hide();
  }

});
