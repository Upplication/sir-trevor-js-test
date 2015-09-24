// require("./slidesshare");
// require("./image-extended");
require("./st-adapter");
require("./button");
require("./widget");

jQuery(function(){
  var sirtrevor = new SirTrevor.Editor({ el: jQuery('.js-st-instance') });

  SirTrevor.EventBus.on('block:create:new', function(){
      console.log('EventBus On block:create:new');
      console.log(arguments);
      console.log(sirtrevor);
      console.log($('form').serialize());
  });

  $('form').submit(function(event){
      // get the data!
      console.log("$(form).submit()");
      // console.log($('form').serialize());
      // console.log(SirTrevor.getInstance().store.retrieve().data);
      // console.log(JSON.stringify(SirTrevor.getInstance().store.retrieve().data));
      event.preventDefault();
  });
});

window.mock = function() {
  // Proc the data save
  $('form#st-form').submit();

  var st = SirTrevor.getInstance();
  var sta = new SirTrevorAdapter();
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
    var html = sta.toHTML(data)
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
    var d1 = sta.fromHTML(html);
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