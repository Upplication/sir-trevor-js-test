// require("./slidesshare");
// require("./image-extended");
//require("./st-adapter");
require("./button");
require("./TextEditor");
require("./widget");
//require("./raptor");
var scribePluginToolbar = require("../../bower_components/scribe-plugin-toolbar/scribe-plugin-toolbar");

jQuery(function(){
  // see: options https://github.com/madebymany/sir-trevor-js/blob/master/src/config.js
  var sirtrevor = new SirTrevor.Editor({ el: jQuery('.js-st-instance')});

    console.log(sirtrevor.formatBar);


  SirTrevor.EventBus.on('block:create:new', function(e){
      //e.;
      //e.$el.trumbowyg();
  });

  $('form').submit(function(event){
      event.preventDefault();
  });
});

window.mock = function() {
  // Proc the data save
  $('form#st-form').submit();
  var adapter = new SirTrevorAdapter();


  var st = SirTrevor.getInstance();

  // force to update data
  st.store.reset();
  st.validateBlocks(false);
  var args = [];

  var clean = function(a) {
    return a.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  var getStData = function() {
    console.log('getStData');
    var d1 = st.store.retrieve().data;
    var d = JSON.stringify(d1, null, 2);
    d = clean(d);
    $('#st-json-raw').html(d);
    args.push(d1);
  }

  var generateHTML = function() {
    console.log('generateHTML');
    var data = args.pop();
    var html = adapter.toHTML(data);
    console.log(html);
    $('#st-html').html(clean(html));
    $('#app-html').html(html);
    args.push(html);
  }

  var resetSirTrevor = function() {
    console.log('resetSirTrevor');
    st.$el.val('');
    st.reinitialize();
  }

  var getJSONfromHTML = function() {
    console.log('getJSONfromHTML');
    var html = args.pop();
    var d1 = adapter.toJSON(html);
    var d = JSON.stringify(d1, null, 2);
    d = clean(d);
    $('#st-json-parsed').html(d);
    args.push(d1);
  }

  var loadIntoSirTrevor = function() {
    console.log('loadIntoSirTrevor');
    var data = args.pop();
    var d = { data: data };
    st.$el.val(JSON.stringify(d));
    st.reinitialize();
  }

  setTimeout(getStData, 0 * 1000);
  setTimeout(generateHTML, 1 * 1000);
  setTimeout(resetSirTrevor, 2 * 1000);
  setTimeout(getJSONfromHTML, 3 * 1000);
  setTimeout(loadIntoSirTrevor, 4 * 1000);

}