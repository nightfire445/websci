    
    // on zipcode form submit, save zipcode
    $('#query-form').submit(function(){
      
      //Send to server
      socket.emit('search', {
                            "query" : $("#query").val(),
                            "num_tweets" : $("#num_tweets").val(),
                            });
      return false;
    });
    



 // load socket.io-client
    var socket = io.connect('http://localhost:3000');


    // on msg received, append to list
    socket.on('tweets', function(twt){

    for (var i = 0; i < twt.length; i++) {
      if(twt[i].hasOwnProperty("text")){
        $('#tweets').append("<li>" + twt[i].text);
      }
    }
    
  });





