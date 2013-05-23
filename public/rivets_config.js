require([ 'rivets', 'moment', 'hub', 'jsmapper/observable' ], function(rivets, moment, hub, observer) {

  function scanForViews() {
    hub.trigger('scanForViews', document.body);
  };

  var subscriberCb = function(callback) {
    var combinedCb = function() {
      callback(); 
      observer.nextCheckOnce(scanForViews)
    }
    subscriberCb = function() { return combinedCb; };
    return subscriberCb();
  }

  rivets.configure({
    adapter: {
      subscribe: function(obj, keypath, callback) {
        callback.wrapped = function(m, v) { 
          callback(v);
          observer.nextCheckOnce(scanForViews);
        };
        observer.watch(obj, keypath, callback.wrapped);
      },
      unsubscribe: function(obj, keypath, callback) {
        observer.unwatch(obj, keypath, callback.wrapped);
      },
      read: function(obj, keypath) {
        return obj[keypath];
      },
      publish: function(obj, keypath, value) {
        obj[keypath] = value;
      }
    }
  });

  rivets.formatters.date = function(value){
    return moment(value).format('MMM DD, YYYY')
  }

  rivets.formatters.dateTime = function(value) {
    return moment(value).format('MMM DD, YYYY - h:mma');
  }

  rivets.formatters.first = function(value) {
    return value[0];
  }

  rivets.formatters.day = function(value){
    return moment(value).format('DD')
  }

  rivets.formatters.month = function(value){
    return moment(value).format('MMM')
  }

  rivets.formatters.toBoolean = function(v) { return !!v; };

  rivets.formatters.at_time = function(value) {
    return '@ ' + moment(value).format('h:mm a');
  }

  rivets.formatters.eq = function(value, arg) {
    return value == arg;
  }

  rivets.binders['tooltip'] = function(el) {
    $(el).tooltip();
  }

  // this preventDefault's on DOM events by default
  oldBinder = rivets.binders['on-*']
  rivets.binders['with-default-on-*'] = {
    'function': true,
    routine: function(el, value) {
      oldBinder.routine.call(this, el, function(e) {
        hub.trigger('observe', 1000);
        value.call(this, e);
      });
    }
  };
  rivets.binders['on-*'] = {
    "function": true,
    routine: function(el, value) {
      rivets.binders['with-default-on-*'].routine.call(this, el, function(e) {
        e.preventDefault(); 
        value.call(this, e); 
      });
    }
  }

  rivets.binders['view'] = {
    bind: function() {
    },
    unbind: function() {

    },
    routine: function(el, value) {
      value = el.getAttribute('data-value');
      hub.trigger('findView', value, function(View) {
        View
      }
    }
  }

  $(document).ajaxComplete(function() { hub.trigger('observe', 1000); });
});
