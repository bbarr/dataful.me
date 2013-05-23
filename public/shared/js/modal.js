define(function(require) {

  var hub = require('hub'),
      $modal = $('#modal'),
      stack = [];

  $modal.on('click', '.close', function(e) { 
    e.preventDefault();
    hub.trigger('modal:hide'); 
  });

  $('body').on('click', '.modal-backdrop', function(e) { 
    e.preventDefault();
    hub.trigger('modal:hide'); 
  });

  hub.on('modal:show', function(viewName) {
    var $container = $('<div class="modal-layer" data-view="' + viewName + '" />');
    $modal.find('.modal-layer').hide();
    stack.push($container);
    $modal.append($container).modal({ show: true, backdrop: 'static' });
    hub.trigger('scanForViews');
  });

  hub.on('modal:hide', function() {

    var $top = stack.pop();
    $top.remove();

    if (stack[0]) {
      stack[stack.length - 1].show();
    } else {
      $modal.modal('hide');
    }
    hub.trigger('scanForViews');
  });
});
