var requestWrapper = function(opts){
  return new function(){
    me = this;
    me.opts = opts;
    me.success = me.loading = me.failed = false;
    me.errorStatus = me.errorBody = '';
    me.data = null;
    me.opts.background = true;
    me.opts.extract = function(xhr){
      if(xhr.status >= 300){
        me.failed = true; me.success = me.loading = false;
        me.errorStatus = xhr.status;
        me.errorBody = xhr.responseText;
        m.redraw();
      }
      return xhr.responseText;
    }

    me.go = function(){
      me = me;
      me.loading = true; me.success = me.failed = false;
      m.request(me.opts)
      .then(function(mydata){
        me.success = true; me.failed = me.loading = false;
        me.data = mydata;
        m.redraw();
      });
    }
  }
}