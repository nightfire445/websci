    
    $('#export-form').submit(function(){
      var format = $("#format").val();
      var filename = $("#filename").val();
      var query = $("#query").val();
      var qty = $("#num_tweets").val();
      //Send to server
      socket.emit('search', {
                            "query" : query ,
                            "num_tweets" : qty,
                            "export": 1,
                            "export_method" : format,
                            "filename" : filename
                            });


      //Error handling
      if(qty === ""){
        qty = 1;
      }

      if(query === ""){
       filename = 'output_RPI_' + qty;
      }

      if(filename != ""){
        alert("Will export tweets to "  + filename + "." + format.toLowerCase() + " file." );
      }
      else {
        filename = 'output_' + query + '_' + qty;
         alert("Will export tweets to "  + filename + "." + format.toLowerCase() + " file." );
      }
      
      return false;
    });
    
    $('#mongoDB-form').submit(function(){
      var button_pressed = document.activeElement.getAttribute('value');
      if(button_pressed == "Build Tweets"){

        //Send to server
        socket.emit('search', {
                              "query" : $("#query").val(),
                              "num_tweets" : $("#num_tweets").val(),
                              "export": 0,
                              "database":"build"
                              });
        alert("Building database with Tweets including your query.");

      }
      else  if(button_pressed == "Read Tweets"){
        //Send to server
        socket.emit('search', {
                              "query" : $("#query").val(),
                              "num_tweets" : $("#num_tweets").val(),
                              "export": 0,
                              "database":"read"
                              });
        alert("Reading Tweets from the database");

      }


      return false;
    });


    $('#reset-form').submit(function(){
      alert("Reseting page.")
      $('#query-form').trigger("reset");
      $('#export-form').trigger("reset");
      $('#mongoDB-form').trigger("reset");
      return false;
    });





 // load socket.io-client
    var socket = io.connect('http://localhost:3000');
 

    // on msg received, append to list
    socket.on('tweets', function(twt){
      for (var i = 0; i < twt.length; i++) {
        if( twt[i].json.hasOwnProperty("text") ){
          $('#tweets').append("<li>" + twt[i].json.text + "</li>");
        }
      }
    
   });


  // on msg received, append to list
    socket.on('warn', function(warning){
      
      alert(warning);
    
   });




