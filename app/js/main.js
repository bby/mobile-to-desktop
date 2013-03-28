requirejs.config({
  baseUrl: 'js',

  paths: {
        text:  'lib/text'
      , zepto: 'lib/zepto-min'
      , three: 'lib/three-min'
  },

  shim: {
    'lib/underscore-min': {
      exports: '_'
    },
    'lib/backbone': {
      deps: ['lib/underscore-min']
    , exports: 'Backbone'
    },
    'lib/socket-io-client-min': {
      exports: 'io'
    },
    'lib/zepto-min': {
      exports: '$'
    },
    'lib/three-min': {
      exports: 'THREE'
    },
    'app': {
      deps: ['lib/underscore-min', 'lib/backbone', 'lib/socket-io-client-min', 'lib/zepto-min', 'lib/three-min']
    }
  }
});

require([
  'app'
],

function(App) {
  window.mobileToDesktop = new App();
});