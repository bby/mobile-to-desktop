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
  console.log('Running on http://192.168.0.5:8080');
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
    console.log('connection made');
    socket.on('mobile', function(data) {
        socket.broadcast.emit('mobile_data', { accelerometer: data });
    });
});