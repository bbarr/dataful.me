define(function(require) {

  var Backbone = require('backbone'),
      rivets = require('rivets'),
      Observable = require('jsmapper/observable'),
      hub = require('hub');

  var fetch = Backbone.Collection.prototype.fetch;

  Backbone.Collection.prototype.build = function() {
    var model = new this.model;
    model.collection = this;
    return model;
  }

  Backbone.View.prototype.watch = Observable.watch;
  Backbone.View.prototype.watchOnce = Observable.watchOnce;
  Backbone.View.prototype.unwatch = Observable.unwatch;
  Backbone.View.prototype.nextCheck = Observable.nextCheck;
  Backbone.View.prototype.link = Observable.link;

  Backbone.View.prototype.buildAndBindHTML = function(template, source) {
    var div = document.createElement('div');
    div.innerHTML = template;
    if (div.childNodes.length == 1) {
      div = div.childNodes[0];
    }
    this.rivetsView = rivets.bind(div, source);
    return div;
  }

  Backbone.View.prototype.is_rendered = function() {
    return !(/^\s*$/.test(this.el.innerHTML))
  }

  Backbone.View.prototype.enable = function() {}
  Backbone.View.prototype.disable = function() {}

  Backbone.View.prototype.clear = function() {
    if (this.rivetsView) this.rivetsView.unbind();
    this.el.innerHTML = '';
  };

  Backbone.View.prototype.render = function() {
    if (this.is_rendered()) return;
    this.el.appendChild(this.build());
    this.trigger('rendered');
    return this.el;
  }

  Backbone.View.prototype.build = function() {
    return this.buildAndBindHTML(this.template, this); 
  }

  Backbone.Model.prototype.decorate = function() {
    return (this.Decorator && !this.decorated) ? new this.Decorator(this) : this;
  }

  Backbone.Collection.prototype.decorate = function() {
    this.models = this.map(function(m) { return m.decorate(); });
    return this;
  }

  Backbone.View.prototype.hub = hub;
  Backbone.Model.prototype.hub = hub;
  Backbone.Collection.prototype.hub = hub;
});
