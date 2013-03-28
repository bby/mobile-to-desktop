define([
	  	'lib/socket-io-client-min'
	  , 'views/app'
],

function(Routes, AppView) {
  var App = function() {
  	this.views.app = new AppView();
  	this.views.app.render();
  	this.connectTo();
  };

  App.prototype = {
    views: {},
    connectTo: function() {
    	var self = this;
    	Backbone.history.start();
    }
  };

  return App;
});