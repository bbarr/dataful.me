require([ 'rivets', 'moment', 'hub' ], function(rivets, moment, hub) {

  /* Adapater */

  rivets.configure({
    handler: function(context, ev, binding) {
      hub.trigger('observe');
      this.call(binding.view.models, ev, context);
    },
    adapter: {
      subscribe: function(obj, keypath, callback) {
        obj.watch(keypath, callback);
      },
      unsubscribe: function(obj, keypath, callback) {
        obj.unwatch(keypath, callback);
      },
      read: function(obj, keypath) {
        hub.trigger('observe');
        return obj[keypath];
      },
      publish: function(obj, keypath, value) {
        obj[keypath] = value;
        hub.trigger('observe');
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

  rivets.formatters.ternary = function(v, a, b) { return v ? a : b; }
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

  // call preventDefault here by default to keep views clean
  rivets.binders['with-default-on-*'] = rivets.binders['on-*'];
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
