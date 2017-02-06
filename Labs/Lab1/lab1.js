//Variables
      increment = 5;
      time = 3000;
      index = 0;
      json = {};

      //Empties and populates the two ul's with information
      function daemon() {
         $("#tweetText").empty();
         $("#suppTweetText").empty();

        for(j = 0; j < 5; j++){
            if(json[index].hasOwnProperty("text")){
              //append Tweet text
                $("#tweetText").append('<li>'+ json[index].text + '</li>');
             
            }
            else{
              index++;
              j--;
              continue;
            }

            if(json[index].hasOwnProperty("entities")){

                    //If missing hashtags
                if(json[index].entities.hashtags.length == 0){
                      //if missing user_mentions
                      if(json[index].entities.user_mentions.length == 0){
                        
                        //ensure urls is there and length is larger than 0
                         if(json[index].entities.hasOwnProperty("urls") && json[index].entities.urls.length > 0 ){
                          //append url
                             $("#suppTweetText").append('<li class = "suppl"> URL: <a href = '+ json[index].entities.urls[0].url+'>'+ json[index].entities.urls[0].url  +'</a></li>');
                         }
                         else{

                              $("#suppTweetText").append('<li class = "suppl">No supplementary data </li>');

                         }
                       
                      }
                      else {

                        string = "";
                        //Build string of all mentioned usernames
                        for(i = 0; i < json[index].entities.user_mentions.length; i++){
                          string = string + "<a href = https://twitter.com/" + json[index].entities.user_mentions[i].screen_name + ">" + json[index].entities.user_mentions[i].screen_name + "</a> ";

                        }


                        $("#suppTweetText").append('<li class = "suppl"> Mentioned: '+ string +'</li>');

                      }


                }

                else{
                  // append hashtags
                   $("#suppTweetText").append('<li class = "suppl"><a href = https://twitter.com/hashtag/' + json[index].entities.hashtags[0].text+ '>#'+ json[index].entities.hashtags[0].text +'</a></li>');

                }


            }
           
              
            index++;

            
           
            //if we move past the end, reset at the beginning
            if(index >= json.length){
              index = 0;
            }
                
          }
              
      }

      //function to continously run setTimeout.
      function runner() {


          $("#tweetText").slideUp(150);
          $("#suppTweetText").slideUp(150);
          daemon();

          $("#tweetText").slideDown(400);
          $("#suppTweetText").slideDown(400);

          setTimeout(function() {
              runner();
          }, time);

      }
    

     function loadTwitterJSON(){

     $.getJSON("TwitterTweets17.json" , function(jsondata){
        json = jsondata;
        runner(); 
      });

     }