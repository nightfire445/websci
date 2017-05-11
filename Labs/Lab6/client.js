    

    $('#query-form').submit(function(){
      
      //Send to server
      socket.emit('search', {
                            "query" : $("#query").val(),
                            "num_tweets" : $("#num_tweets").val(),
                            "export": 0,
                            });
      alert("Looking for Tweets with your query");
      return false;
    });
    


    $('#export-form').submit(function(){
      format = $("#format").val();
      //Send to server
      socket.emit('search', {
                            "query" : $("#query").val(),
                            "num_tweets" : $("#num_tweets").val(),
                            "export": 1,
                            "export_method" : format,
                            });
      alert("Will export tweets to a " + format + " file." );
      return false;
    });
    



 // load socket.io-client
    var socket = io.connect('http://localhost:3000');
 

    // on msg received, append to list
    socket.on('tweets', function(twt){
      for (var i = 0; i < twt.length; i++) {
        if( twt[i].hasOwnProperty("text") ){
          $('#tweets').append("<li>" + twt[i].text);
        }
      }
    
   });


  // on msg received, append to list
    socket.on('warn', function(warning){
      console.log("warning");
      alert(warning);
    
   });




