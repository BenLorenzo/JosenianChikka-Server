var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Express initializes app to be a function handler that you can supply to an HTTP server (as seen in line 2).
// We define a route handler / that gets called when we hit our website home.
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('message',function(data){
        var sockets = io.sockets.sockets;
        sockets.forEach(function(sock){
            if(sock.id != socket.id)
            {
            	console.log(data);
                sock.emit('message',data);
            }
        });
    });


  // Each socket also fires a special disconnect event:
    socket.on('disconnect',function(){
        console.log('one user disconnected '+socket.id);
    });
});


// In this case, for the sake of simplicity we’ll send the message to everyone, including the sender.
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
  	console.log(msg);
    io.emit('chat message', msg);
  });
});

// If you want to send a message to everyone except for a certain socket, we have the broadcast flag:
// io.on('connection', function(socket){
//   socket.broadcast.emit('hi');
// });

// We make the http server listen on port 3000.
http.listen(3000, function(){
  console.log('listening on *:3000');
});