var thread = {};

thread.Thread = function(data){
  this.urlPath = m.prop(data.urlPath);
}

thread.ThreadList = Array;

thread.vm = (function(){
  var vm = {}
  vm.init = function() {
    vm.list = new thread.ThreadList();

    vm.threadSubString = m.prop("");

    vm.startThread = function(){
      if (vm.threadSubString()) {
        fullUrl = "https://reddit.com/r/" + vm.threadSubString() + ".json?sort=new&depth=1&limit=15"
        vm.list.push(new thread.Thread({urlPath: fullUrl}));
        vm.threadSubString("");
      }
    };
  }
  return vm;
}())

thread.controller = function(){
  thread.vm.init();
}

thread.view = function(){
  return m("div", [
    m("h4", "/r/"),
    m("input", {onchange: m.withAttr("value", thread.vm.threadSubString), value: thread.vm.threadSubString()}),
    m("button", {onclick: thread.vm.startThread}, "load thread"),
    m("table", [
      thread.vm.list.map(spawnThread)
    ])
  ]);

  function spawnThread(thread){
    return m("td", [
      // m("table", Request.postResponse.data[1].data.children.map(function(commentObj){
      //         return m("tr", [m("td", commentObj.data.body), m("td", commentObj.data.created), m("td", commentObj.data.author)]);
      //       }))
      m("p", thread.urlPath()),
    ])
  }
}

m.mount(document.getElementById("tiny"), {controller: thread.controller, view: thread.view});