// server init + mods
var app = require('express')();
var httpLib = require('http');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var APIKEY = "3345ec4b84dfb2976c0b089ab609f635";
var data = "";

// server route handler
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


var options = {
  host: 'api.openweathermap.org',
  port: '80',
  path: '/data/2.5/weather?&units=imperial&callback=?&',
};

var req = httpLib.request(options, function(res) => {
     console.log(`STATUS: ${res.statusCode}`);
     console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
     
     res.setEncoding('utf8');
     res.on('data', (chunk) => {
       console.log(`BODY: ${chunk}`);
     });

     res.on('end', () => {
       console.log('No more data in response.');
     });

    });

// write the request parameters
req.write('zip='+data);
req.write('APPID='+data);

req.end();



io.on('connect', function(socket){
    // log & brodcast connect event
  console.log("user connected");

     // log disconnect event
  socket.on('disconnect', function(){
    console.log('user disconnecteda');
  });

  // zipcode submit event
  socket.on('zipcode', function(zipcode){
    data = zipcode;
    console.log('zipcode: '+ zipcode);
    

  });


    //socket.broadcast.emit('message', msg);

});




    

// start server
http.listen(3000, function(){
  console.log('Server up on *:3000');
});