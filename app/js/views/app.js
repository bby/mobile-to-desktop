define([
  'text!templates/app.html'
],

function(template, AddListView, EditListView) {
  var AppView = Backbone.View.extend({
    id: 'main',
    tagName: 'div',
    className: 'container',
    el: '#mtd-app',
    template: _.template(template),

    events: {
    },

    initialize: function() {
    },

    render: function() {
      this.$el.html(this.template());
      var isiPhone = navigator.userAgent.match(/iPhone/i) != null;
      var isiPad = navigator.userAgent.match(/iPad/i) != null;
      var isAndroid = navigator.userAgent.match(/Android/i) != null;

      var x,y;
      var tilt = function(dataArr) {
          x = dataArr[0];
          y = dataArr[1];
      }

      //**************** so: 3D Setup ****************//

      var container, stats;

      var camera, scene, renderer;

      var cube, plane;

      var targetRotation = 0;
      var targetRotationOnMouseDown = 0;

      var mouseX = 0;
      var mouseXOnMouseDown = 0;

      var windowHalfX = window.innerWidth / 2;
      var windowHalfY = window.innerHeight / 2;

      //init
      container = document.createElement( 'div' );
      document.body.appendChild( container );

      camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
      camera.position.y = 150;
      camera.position.z = 500;

      scene = new THREE.Scene();

      // Cube

      var geometry = new THREE.CubeGeometry( 200, 200, 200 );

      for ( var i = 0; i < geometry.faces.length; i ++ ) {

        geometry.faces[ i ].color.setHex( Math.random() * 0xffffff );

      }

      var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors } );

      cube = new THREE.Mesh( geometry, material );
      cube.position.y = 150;
      scene.add( cube );

      // Plane

      var geometry = new THREE.PlaneGeometry( 200, 200 );
      geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

      var material = new THREE.MeshBasicMaterial( { color: 0xe0e0e0 } );

      plane = new THREE.Mesh( geometry, material );
      scene.add( plane );

      renderer = new THREE.CanvasRenderer();
      renderer.setSize( window.innerWidth, window.innerHeight );

      container.appendChild( renderer.domElement );

      

      //**************** eo: 3D Setup ****************//

      var debug = document.getElementById("debug");
      var status = document.getElementById("status");
      var mobile_status = document.getElementById("mobile-status");
      //
      var socket = io.connect('http://192.168.0.5:8080');
      var pair_number = Math.floor(Math.random()*1000);
      var pair_button = document.getElementsByTagName("button")[0];
      var pair_display = document.getElementById('pair-number');
      
      status.innerHTML = 'Visit this page on your mobile'
      pair_display.innerHTML = pair_number;
      
      if(!isiPhone && !isAndroid && !isiPad) {
        desktop_ui = document.getElementById("desktop");
        desktop_ui.style.display = "block";
        socket.emit('register', { pair: pair_number });
      }

      pair_button.onclick = function() {
        pair_response_field = document.getElementById("pair_response");
        pair_response_value = pair_response_field.value;
        socket.emit('pair', { pair: pair_response_value });
      }

      socket.on('successful', function (data) {
        mobile_status.innerHTML = "Paired";
        mobile_status.style.color = "green";
      });

      socket.on('unsuccessful', function (data) {
        mobile_status.innerHTML = "Wrong number";
        mobile_status.style.color = "red";
      });

      socket.on('disconnected', function (data) {
        status.innerHTML = "Disconnected";
        status.style.color = "red";
        mobile_status.innerHTML = "Disconnected";
        mobile_status.style.color = "red";
      });


      socket.on('mobile_data', function (data) {
        status.innerHTML = "Mobile Connected";
        status.style.color = "green";

        var xData = Math.round( parseFloat( data.accelerometer.x ) );
        var yData = Math.round( parseFloat( data.accelerometer.y ) );

        targetRotation = xData * 0.05;
        plane.rotation.x = cube.rotation.x += ( targetRotation - cube.rotation.x);

        targetRotation = yData * 0.05;
        plane.rotation.y = cube.rotation.y += ( targetRotation - cube.rotation.y);

        renderer.render( scene, camera );
      });

      if(isiPhone || isAndroid || isiPad) {
        var mobile_ui = document.getElementById("mobile");
        mobile_ui.style.display = "block";
        pair_display.style.display = "none";

        if (window.DeviceOrientationEvent) {
            window.addEventListener("deviceorientation", function () {
                tilt([event.beta, event.gamma]);
            }, true);
        } else if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', function () {
                tilt([event.acceleration.x * 2, event.acceleration.y * 2]);
            }, true);
        } else {
            window.addEventListener("MozOrientation", function () {
                tilt([orientation.x * 50, orientation.y * 50]);
            }, true);
        }

        setInterval(function() {
            socket.emit('mobile', { x: x, y: y, pair: pair_response_value});
        }, 100);
      }
      return this;
    },
  });

  return AppView;
});