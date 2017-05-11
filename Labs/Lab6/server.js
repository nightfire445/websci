// server init + mods
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var json2csv = require('json2csv');

var TwitterStream = require('twitter-stream-api');
 
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
app.get('/client.js', function(req, res){
  res.sendFile(__dirname + '/client.js');
});

app.get('/client_socket.io.js', function(req, res){
  res.sendFile(__dirname + '/node_modules/socket.io-client/dist/socket.io.js');
});




io.on('connect', function(socket){

    // log & brodcast connect event

  console.log("user connected");

     // log disconnect event
  socket.on('disconnect', function(){
    console.log('user disconnecteda');
  });

  // zipcode submit event
  socket.on('search', function(search_data){

    var qty = search_data["num_tweets"];
    if(qty === ""){
      qty = 1;
    }

    var query = search_data["query"];
    var xy_coordinate = search_data["position"];
    
    var Twitter = new TwitterStream(keys);
     var count = 0;
    var tweets = [];

    Twitter.on('data', function (twt) {
      //only output the desired number of tweets.
        if(count < qty){
          tweets.push(twt);
          count++;

          if(count == qty){
            //when we reach the quota, either emit or export and close the stream
            if(search_data["export"]){
              if(search_data["export_method"] == "JSON"){
                saveTweets(tweets);     
              }
              else if(search_data["export_method"] == "CSV"){
                saveTweetsCSV(tweets, socket);
              }

              
            }
            else {
              socket.emit("tweets", tweets);

            }
          
          Twitter.close();

         
         
          
         }
        
        }

    });

    
   
    
    if(query != ""){
      console.log("tracking " + query);
      //assign query to track index 

      Twitter.stream('statuses/filter', {
          track: query
      });

     filename = 'output_' + query + '_' + qty;
   
    }
    else {
           //assign location to track tweets in the RPI area

      console.log("tracking RPI location");
      Twitter.stream('statuses/filter', {
      locations: -73.68 + "," + 42.72 + "," + -73.67 + "," + 42.73
      });

       filename = 'output_RPI_' + qty;
    }





  });


  

});




    

// start server
http.listen(3000, function(){
  console.log('Server up on *:3000\n');
});


function saveTweets(tweets){


      fs.appendFile(filename + '.json', '[' , (err) => {
        if (err) throw err;
        console.log('"[" was appended to file: ' + filename + '.json');
      });

      //since we add a comma, only go to length-1
      for (var i = 0; i < tweets.length -1; i++) {

        fs.appendFile(filename + '.json', JSON.stringify(tweets[i]) + "," , (err) => {
          if (err) throw err;
              console.log('"tweet," was appended to file!');
          });

        
      }
      //Closing tweet, so add a ]
      fs.appendFile(filename + '.json', JSON.stringify(tweets[i]) + "]" , (err) => {
      if (err) throw err;
         console.log('"tweet]" was appended to file!');
      });
        
     
  }


function saveTweetsCSV(myData, socket){
  //fields to access/label data from the json object
  var fields = ["created_at", "id", "text", "user_id", "user_name", "user_screen_name", "user_location", "user_followers_count", "user_friends_count", "user_created_at", "user_time_zone", "user_profile_background_color", "user_profile_image_url", "geo", "coordinates"];

  try {


    //check if the file exists
      fs.stat(filename + '.csv', function(err, stat) {
          if(err == null) {
              //Send warning to client
              socket.emit("warn", "Overwriting file " + filename + ".csv");
              fs.unlink('./' + filename + '.csv',function(err){
                  if(err) return console.log(err);
             });  
          }
          else {
              console.log('Some other error: ', err.code);
          }
      });

      var result = []
      //convert each tweet to CSV and store in result
      for (var i = myData.length - 1; i >= 0; i--) {
        result.push(json2csv({ data: myData[i] , fields: fields }));

      }
    


      //Save result to file
        fs.appendFile(filename + '.csv', result , (err) => {
        if (err) throw err;
        console.log('"result" was stored to file: ' + filename + '.csv');
      });


  } catch (err) { console.error(err);  }


}
