let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket)
{
  socket.on('message', function(msg){
    console.log('message: ' + msg);
	io.emit('message', msg);
  });
});

io.on('connection', function(socket)
{
  socket.on('loginRpt', function(id, pw){
    console.log('loginRpt: ' + id + pw);
	io.emit('message', 'loginRpt: ' + id);
	io.emit('loginRpt', id);
  });
});

io.on('connection', function(socket)
{
  socket.on('registerRpt', function(id, pw){
    console.log('registerRpt: ' + id + pw);
	io.emit('message', 'registerRpt: ' + id);
	io.emit('registerRpt', "Succeed");
  });
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.broadcast.emit('message', "a user connected!");
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(5000, function(){
  console.log('listening on *:5000');
});

io.on('connection', function(socket){
  
});