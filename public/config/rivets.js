require([ 'rivets', 'moment', 'hub' ], function(rivets, moment, hub) {

  /* Adapater */

  rivets.configure({
    adapter: {
      subscribe: function(obj, keypath, callback) {
        obj.watch(keypath, callback);
      },
      unsubscribe: function(obj, keypath, callback) {
        obj.unwatch(keypath, callback);
      },
      read: function(obj, keypath) {
        return obj[keypath];
      },
      publish: function(obj, keypath, value) {
        obj[keypath] = value;
      }
    }
  });

  /* FORMATTERS */

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
  rivets.formatters.stringify = function(v) { return JSON.stringify(v); }

  rivets.formatters.at_time = function(value) {
    return '@ ' + moment(value).format('h:mm a');
  }

  rivets.formatters.eq = function(value, arg) {
    return value == arg;
  }

  /* BINDERS */

  rivets.binders['tooltip'] = function(el) {
    $(el).tooltip();
  }

  // ALWAYS trigger 'observe' (dirty-check models) when a DOM interaction happens
  // and call preventDefault here by default to keep views clean
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

  // weird place for this, but basically, make sure to trigger observe after an ajax request
  $(document).ajaxComplete(function() { hub.trigger('observe', 1000); });
});
