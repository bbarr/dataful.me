define(function(require) {

  var observable = require('jsmapper/observable'),
      hub = require('hub'),
      interval = null,
      timeLeft = 0, 
      DEFAULT_DURATION = 1000,
      STEP_DURATION = 50;

  function start() {
    interval = setInterval(function() {
      observable.check();
      timeLeft -= STEP_DURATION;
      if (timeLeft < 0) stop();
    }, STEP_DURATION);
  }

  function stop() {
    clearInterval(interval)
    interval = null;
    timeLeft = 0;
  }

  hub.on('observe', function(ms) {
    timeLeft += ms || DEFAULT_DURATION;
    if (!interval) start();
  });

  observable.onChange(function() {
    hub.trigger('scanForViews');
  });
});
