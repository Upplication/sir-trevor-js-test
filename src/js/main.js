require("./slidesshare");
require("./image-extended");
require("./button");

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
      console.log($('form').serialize());
      console.log(SirTrevor.getInstance().store.retrieve().data);
      event.preventDefault();
  });
});
