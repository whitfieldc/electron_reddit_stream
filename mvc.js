var thread = {};

thread.Thread = function(data){
  this.urlPath = m.prop(data.urlPath);
  currentThread = this
  currentThread.data = null
  currentThread.success = currentThread.loading = currentThread.failed = false;

  this.userAgentConfig = function(xhr) {
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "http://localhost:8000");
    xhr.setRequestHeader("UserAgent", "web:com.firebaseapp.multistream:v0.0.1 (by /u/retiredhipster");
  };
  // User-Agent: android:com.example.myredditapp:v1.2.3 (by /u/kemitche)
  // m.request({method: "POST", url: "/foo", config: xhrConfig});
  this.getForever = function(){
    console.log('fetching');
    currentThread.getRequest();
    console.log('fetched');
    setTimeout(currentThread.getForever, 30000);

  }
  this.getRequest = function(){
    currentThread = currentThread;
    currentThread.loading = true; currentThread.success = currentThread.failed = false;
    // currentThread.opts = {method:"GET", url:"http://maru-todo.herokuapp.com/tasks"}
    currentThread.opts = {method:"GET", url:currentThread.urlPath(), config: currentThread.userAgentConfig}
    // console.log('in GO')
    // console.log(currentThread.urlPath())
    // console.log(currentThread)
    m.request(currentThread.opts)
    .then(function(mydata){
      console.log(mydata);
      currentThread.success = true; currentThread.failed = currentThread.loading = false;
      currentThread.data = mydata;
      m.redraw();
    });
  }
}

thread.ThreadList = Array;

thread.vm = (function(){
  var vm = {}
  vm.init = function() {
    vm.list = new thread.ThreadList();

    vm.threadSubString = m.prop("");

    vm.startThread = function(){
      if (vm.threadSubString()) {
        fullUrl = "http://www.reddit.com/r/" + vm.threadSubString() + ".json?sort=new&depth=1&limit=15"
        var newThread = new thread.Thread({urlPath: fullUrl});
        console.log('in startThread')
        console.log(fullUrl)
        console.log(newThread)
        newThread.getForever();
        vm.list.push(newThread);
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
      thread.vm.list.map(buildThread)
    ])
  ]);

  function buildThread(newThread){
    if(!newThread.success){return;}
    console.log(newThread)
    return m("td", [





    m("table", newThread.data[1].data.children
      .map(function(commentObj){
        return m("tr", [m("td", commentObj.data.body), m("td", commentObj.data.created), m("td", commentObj.data.author)]);
      }))
      // m("p", thread.urlPath()),
    ])
  }
}

m.mount(document.getElementById("tiny"), {controller: thread.controller, view: thread.view});