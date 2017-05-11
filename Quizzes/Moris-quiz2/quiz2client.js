
 $('#zip-form').submit(function(){
      socket.emit('search', {
                            "zipcode" : $("#zip").val()
                            });
      return false;
    });

  $('#output-form').submit(function(){
      socket.emit('output', {
                            "zipcode" : $("#zip").val()
                            });
      return false;
    });

  $('#display-form').submit(function(){
      socket.emit('display', {
                            "zipcode" : $("#zip").val()
                            });
      return false;
    });

var socket = io.connect('http://localhost:8000');

// on msg received, append to list
socket.on('warn', function(warning){
  
  alert(warning);
  $("#display-form").toggle();
});


 // on msg received, append to list
socket.on('weathers', function(wthrs){
  console.log(wthrs);
  for (var i = 0; i < wthrs.length; i++) {
      div = "<div>" + "<p>" + wthrs[i].json.location + "</p><p>" + wthrs[i].json.zipcode + "</p>" + "<p>" + wthrs[i].json.temperature + "</p></div>";
      $('#weathers').append("<li>" + div + "</li>");
  }

});
