// server init + mods
var app = require('express')();
var httpLib = require('http');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var json2csv = require('json2csv');
var js2xmlparser = require("js2xmlparser");
var mongoose = require('mongoose');

globalmodel = ""
globalsocket = "";

//// Global Variables
//URL to grab icons for weather
APIiconsURL = "http://openweathermap.org/img/w/" //04d.png
APIKEY = "3345ec4b84dfb2976c0b089ab609f635";
 
  //Salt secrets

var keys = {
    consumer_secret: 'jdics0kBGsfQFVA1Xe5bMAZoyAjR6VWbEnAygkoOqljPCGWdim',
    consumer_key: '1pLY5OSorjPgRtgVtl4rhEMOC',
    token: '2262267464-LJBoGqOKe3PI3cm5IeAS8BstIlInHavJoDtMyIx',
    token_secret: 'i41D8MsSKNM4hHpFeG9MSdRBMP65YORyO7dZYCKpqbwTj'
};




// server route handler
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//Need to route these so index.html can access them
app.get('/quiz2client.js', function(req, res){
  res.sendFile(__dirname + '/quiz2client.js');
});

app.get('/client_socket.io.js', function(req, res){
  res.sendFile(__dirname + '/node_modules/socket.io-client/dist/socket.io.js');
});




io.on('connect', function(socket){

    // log & brodcast connect event

  console.log("user connected");
  globalsocket = socket;
     // log disconnect event
  socket.on('disconnect', function(){
    console.log('user disconnecteda');
  });

  // zipcode submit event
  socket.on('search', function(search_data){

    zip = search_data["zipcode"];
    console.log(zip);
    getWeather(zip);



  });
   // display submit event
  socket.on('display', function(search_data){

    db = connectMongo();

     if(globalmodel != ""){
        Weather = globalmodel;

      }
      else{
         var weatherSchema = mongoose.Schema({
          json: Object
      }); 

      var Weather = mongoose.model('Weather', weatherSchema);
      globalmodel = Weather;


      }

    db.once('open', function() {
     
      Weather.find("Weathers",'json',function (err, weathers_mongo) {
        if (err) return console.error(err);               
        socket.emit("weathers", weathers_mongo);
        
      })

    });


  });


  // display submit event
  socket.on('output', function(search_data){

    db = connectMongo();

     if(globalmodel != ""){
        Weather = globalmodel;

      }
      else{
         var weatherSchema = mongoose.Schema({
          json: Object
      }); 

      var Weather = mongoose.model('Weather', weatherSchema);
      globalmodel = Weather;


      }

    db.once('open', function() {
     
      Weather.find("Weathers",'json',function (err, weathers_mongo) {
        if (err) return console.error(err);               
        saveTweets(weathers_mongo);
         
      })

    });
    
    socket.emit("warn", "Your data has been outputted to a file named Q2Q1c-moris.json");

  });
  

});




    

// start server
http.listen(8000, function(){
  console.log('Server up on *:8000\n');
});


function saveTweets(tweets){

      filename ="Q2Q1c-moris"
      fs.appendFile(filename + '.json', '[' , (err) => {
        if (err) throw err;
        
      });

      //since we add a comma, only go to length-1
      for (var i = 0; i < tweets.length -1; i++) {

        fs.appendFile(filename + '.json', JSON.stringify(tweets[i]) + "," , (err) => {
          if (err) throw err;
              
          });

        
      }
      //Closing tweet, so add a ]
      fs.appendFile(filename + '.json', JSON.stringify(tweets[i]) + "]" , (err) => {
      if (err) throw err;
        
      });
        
     
  }


function getWeather(zipcode){
  

  var options = {
  host: 'api.openweathermap.org',
  port: '80',
  path: '/data/2.5/weather?zip='+ zipcode + ",us" + '&units=imperial&callback=?&APPID=' + APIKEY,

  };

  console.log('making request');
  var req = httpLib.request(options, (res) => {

   //console.log(`STATUS: ${res.statusCode}`);
   //console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
   
   res.setEncoding('utf8');
   res.on('data', (chunk) => {
     //console.log(`BODY: ${chunk}`);
     jsonchunk = JSON.parse(chunk.slice(2,chunk.length-1))
     locationname = jsonchunk.name;
     temp = jsonchunk.main.temp;
     //already have zipcode

    db = connectMongo();
    documentJSON = { 'location' : jsonchunk.name, 'temperature' : jsonchunk.main.temp, "zipcode": zipcode }    
    

    db.once('open', function() {

      if(globalmodel != ""){
        Weather = globalmodel;

      }
      else{
         var weatherSchema = mongoose.Schema({
          json: Object
      }); 

      var Weather = mongoose.model('Weather', weatherSchema);
      globalmodel = Weather;
      var weather = new Weather({ json: documentJSON });


      }
     
      weather.save(function (err) {
      
      if (err) {
        return handleError(err);
      }
      weather.json; 
          // saved!
      });
      console.log("Saved stuff");
      globalsocket.emit("warn", "Your zipcode has been added to the database");
              });
    db.close();
   });



   res.on('end', () => {
     console.log('\nNo more data in response.');
   });

  });

req.end();

}


function connectMongo(){
  //Since mongoose default promise library is deprecated
  mongoose.Promise = global.Promise;
  mongoose.connect('mongodb://localhost/SweaterWeather');
  mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
  return mongoose.connection;

}