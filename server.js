var connect = require('connect')
  , http = require('http')
  , app
  , server
  ;

app = connect()
  .use(connect.static('app'))
  .use('/js/lib/', connect.static('node_modules/requirejs/'))
  .use('/node_modules', connect.static('node_modules'))
  ;

server = http.createServer(app).listen(8080, function() {
  console.log('Running on http://localhost:8080');
});

var users = [], clients = [];
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {

    socket.on('register', function(data) {
      users[data.pair] = socket.id;
      clients[socket.id] = socket;
      console.log("registering desktop client");
    });

    socket.on('pair', function(data) {
      console.log("pairing mobile client");
      console.log(clients[users[data.pair]]);
      if(clients[users[data.pair]]!=undefined) {
        //controllers[socket.id] = data.pair;
        io.sockets.socket(socket.id).emit('successful');
        console.log("pairing successful");
      } else {
        io.sockets.socket(socket.id).emit('unsuccessful');
        console.log("pairing unsuccessful");
      }
      
    });

    // socket.on('disconnect', function() {
    //   io.sockets.socket(socket.id).emit('disconnected');
    // });

    socket.on('mobile', function(data) {
      if(clients[users[data.pair]]!=undefined) {
        clients[users[data.pair]].emit('mobile_data', { accelerometer: data });
      }
    });

});