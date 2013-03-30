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

var users = [], clients = [], pairings = [];
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

        pairings[socket.id] = [];
        pairings[socket.id]["socket"] = clients[users[data.pair]];
        pairings[socket.id]["socketid"] = users[data.pair];
        pairings[socket.id]["pair"] = data.pair

        pairings[users[data.pair]] = [];
        pairings[users[data.pair]]["socket"] = socket;
        pairings[users[data.pair]]["socketid"] = socket.id;
        pairings[users[data.pair]]["pair"] = data.pair


        socket.emit('successful');

        console.log("pairing successful");

      } else {

        io.sockets.socket(socket.id).emit('unsuccessful');
        console.log("pairing unsuccessful");

      }
      
    });

    socket.on('disconnect', function() {

      console.log('a client disconnected');
      
      //if its paired let the other party no its disconnected
      if(pairings[socket.id]!=undefined) {
        pairings[socket.id]['socket'].emit('disconnected');
        delete pairings[pairings[socket.id]['socketid']];
        delete pairings[socket.id];
      }

      console.log(pairings.length);

      //if its the desktop disconnecting delete
      if(clients[socket.id]!=undefined) {
        delete users[users.indexOf(socket.id)]
        delete clients[socket.id]
      }

    });

    socket.on('mobile', function(data) {
      if(pairings[socket.id]!=undefined) {
        pairings[socket.id]['socket'].emit('mobile_data', { accelerometer: data });
      }
    });

});