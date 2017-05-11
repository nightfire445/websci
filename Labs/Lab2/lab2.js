
//// Global Variables
//URL to grab icons for weather
APIiconsURL = "http://openweathermap.org/img/w/" //04d.png
APIKEY = "3345ec4b84dfb2976c0b089ab609f635";
time = 4000
current_index = 0;



function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."
            break;
    }
}


function appendCurrentWeather(data){
	var temper_div = " ";
    //DEBUG:
    //console.log(data);


    var date = new Date();
    var day = date.getDay();  
    var hours = date.getHours();
    var minutes = date.getMinutes();
    if(minutes < 10){
        minutes = "0"+minutes;
    }
        
    var weekday = new Array();
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";


        //Append the different temperatures if theyre not the same value
		if( data.main.temp != data.main.temp_min && data.main.temp != data.main.temp_max){
			temper_div = "<div class = 'temperature' id = 'temp'><p id = 'title'>Temperature</P><p id = 'temp'>Current: " + data.main.temp +"°</p><p id = 'max'>Max: " + data.main.temp_max + "°</p><p id = 'min'>Min: " + data.main.temp +"°</p></div>";


		}
		else{
			temper_div = "<div id = 'temp'><p id = 'temp'>" + data.main.temp +"°</p></div>";
		}
        //DEBUG:
		//console.log(data.main);

        //Elements

    	var loc_p = "<p class = 'title' id = 'loc_name'>" + data.name + "</p>";

    	var wind_p = "<p id = wind_speed>Windspeed: " + data.wind.speed + " mph </p> ";

    	var weather_img = "<img id = 'weather_icon' src='" + APIiconsURL + data.weather[0].icon  + ".png'alt='Weather icon " + data.weather[0].main + "'>";

    	var cloud_div  = "<div class 'cloudbox' id = 'cloud'><p id = 'coverage'>Cloud coverage: " + data.clouds.all + "%</p><p id = weather_description>"+ data.weather[0].description + "</p>"+ weather_img + "</div>";
        
        var time_p = "<p class = 'title' id = 'time'>" + weekday[day] + " " + hours + ":" + minutes + "</p>";
 
        //append our elements
    	$("#Weather").append( loc_p + time_p + temper_div + wind_p );
    	$("#Weather").append( cloud_div );

    	var rainstring = "";
    	var snowstring = "";  

        //Check if we can get precipiation data

    	if(data.hasOwnProperty("rain") ){
    		rainstring = "<p id = rain>" + data.rain[0] +"</p>";
    	}

    	if(data.hasOwnProperty("snow") ){
    		snowstring = "<p id = snow>" + data.snow[0] +"</p>";
    	}
        //Now add it if it exists
        if(  data.hasOwnProperty("snow") || data.hasOwnProperty("rain")  ){

            $("#Weather").append("<div id = precipitation>"+ rainstring + snowstring + "</div>");

        }
    	
    	
}


function appendThreeHData(data, parent_index, index){

       
        //append data from ThreeH

  
        //DEBUG:
		//console.log(data);
        //Build elements
		var loc_p = "<p id = 'loc_name'>" + data.city.name + "</p>";

		var temper_div = "";
        //Append the different temperatures if theyre not the same value
		if( data.list[index].main.temp != data.list[index].main.temp_min && data.list[index].main.temp != data.list[index].main.temp_max){
			temper_div = "<div class = ' temperature' id = 'temp'><p id = 'temp'>" + data.list[index].main.temp +"</p><p id = 'max'>" + data.list[index].main.temp_max + "</p><p id = 'min'>" + data.list[index].main.temp_min +"°</p></div>";


		}
		else{
			var temper_div = "<div id = 'temp'><p id = 'temp'>" + data.list[index].main.temp +"</p></div>";
		}
	
		var date = new Date(data.list[index].dt_txt);
	

		// get values from the date object
		var day = date.getDay();	 
		var hours = date.getHours();
		//used to turn the day # to a string
		var weekday = new Array();
		weekday[0] = "Sunday";
		weekday[1] = "Monday";
		weekday[2] = "Tuesday";
		weekday[3] = "Wednesday";
		weekday[4] = "Thursday";
		weekday[5] = "Friday";
		weekday[6] = "Saturday";



		//Append data 

    	$("#ThreeH_Group_" + parent_index).append("<div class = 'threeH col-md-1' id = 'ThreeH_" + index + "'><p class = 'title' id = 'date'>" + weekday[day] + " " + hours + ":00" +"</p>" + temper_div + "<p id = wind_speed>" + data.list[index].wind.speed + " mph </p></div>");



    	var rainstring = "";
    	var snowstring = "";

         //Check if we can get precipiation data
    	if(data.hasOwnProperty("rain") ){
    		rainstring = "<p id = rain>" + data.list[index].rain[0] +"</p>";
    	}

    	if(data.hasOwnProperty("snow") ){
    		snowstring = "<p id = snow>" + data.list[index].snow[0] +"</p>";
    	}

         //Now add it if it exists
        if(  data.hasOwnProperty("rain") || data.hasOwnProperty("snow")  ){

            $("#day_"+index).append("<div id = precipitation>"+ rainstring + snowstring + "</div>");


        }

    	
    	

}


function appendDailyData(data, index){
    //DEBUG
	//console.log(index);

	var temper_div = "";
    var target = "";

    //Get date data
    var date = new Date();
    var day =  (date.getDay() + index +1 ) % 7; 
 
    var day_date = date.getDate();       
    var hours = date.getHours();
    //Used to turn date integer into day string
    var weekday = new Array();
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    //if the temperatures have different values build them both
		if( data.list[index].temp.min != data.list[index].temp.masx){
			temper_div = "<div class = 'temperature' id = 'temp'><p id = 'title'>Temperature</P><p id = 'max'>Max: " + data.list[index].temp.max + "°</p><p id = 'min'>Min: " + data.list[index].temp.min +"°</p></div>";


		}
		else{
			temper_div = "<div id = 'temp'><p id = 'temp'>" + data.list[index].temp +"°</p></div>";
		}

		//DEBUG
    	//console.log(data.main);


        //Build elements

    	var wind_p = "<p id = wind_speed>Windspeed: " + data.list[index].speed + " mph </p> ";

    	var weather_img = "<img id = 'weather_icon' src='" + APIiconsURL + data.list[index].weather[0].icon  + ".png'alt='Weather icon " + data.list[index].weather[0].main + "'>";

    	var cloud_div  = "<div class = 'cloudbox' id = 'cloud'><p id = 'coverage'>Cloud coverage: " + data.list[index].clouds + "%</p><p id = weather_description>"+ data.list[index].weather[0].description + "</p>"+ weather_img + "</div>";

        var date_p =  "<p class = 'title' id = 'date'>" + weekday[day] + ", " + (day_date + index + 1)  + "</p>"

        var daily_div = "<div class = 'daily col-md-2' id = 'daily_" + index + "'>" + date_p + temper_div + wind_p + "</div>";

        //check for precipitation data
        var rainstring = "";
        var snowstring = "";

        //DEBUG
        //console.log(index);
        

        //Indexes past 4 belong in a different ul.
        if(index < 5){
            target = "ExtForecastStationary";

        }
        else{

            target = "ExtForecast";

        }

        if(data.hasOwnProperty("rain") ){
            rainstring = "<p id = rain>" + data.rain[0] +"</p>";
        }

        if(data.hasOwnProperty("snow") ){
            snowstring = "<p id = snow>" + data.snow[0] +"</p>";
        }
        //append any precipitation data
        if( data.hasOwnProperty("snow") || data.hasOwnProperty("rain")  ){

            $("#" + target).append("<div id = precipitation>"+ rainstring + snowstring + "</div>");
        }


        //Append the other elements
    	$("#" + target).append( daily_div );
    	$("#daily_" + index).append( cloud_div );

        //toggleslide ThreeH data for the specific day
        $( document ).on( "mouseenter", "#daily_" + index , function( event ) { $( "#ThreeH_Group_" + index ).slideToggle(function(){

        }); });

        $( document ).on( "mouseleave", "#daily_" + index , function( event ) { $( "#ThreeH_Group_" + index ).slideToggle(function(){

    

        }); });
        //dont apply to first 5 (forecast), 6th & 10th are the "anchor" for the animation so it doesnt cause the screenheight to increase or decrease
        if(index > 5 && index != 10){
            $( "#daily_" + index ).toggle( "slide" ); $( "#daily_" + index ).toggle( "slide" );
        }            
         


    	

}




function daemon(data){
//payload for runner

	$("#ExtForecast").empty();
	for(var i =0; i < 5; i++){
		
            
    		appendDailyData(data, current_index);
            current_index++;
    		if(current_index >= data.cnt){
                //Don't repeat the Stationary Forecast
              current_index = 5;
            }

           
    	}




}



function runner(data) {
//function to continously run setTimeout.


  daemon(data);

  setTimeout(function() {
      runner(data);
  }, time);

}
    


function getWeather(position){
    //getGeoLocation
	var lat = position.coords.latitude;
	var lon = position.coords.longitude;

	WeatherURL = "http://api.openweathermap.org/data/2.5/weather?lat="+ lat +"&lon=" + lon + "&units=imperial&callback=?&APPID=" + APIKEY;
    //getCurrentWeather
	ThreeHForecastURL = "http://api.openweathermap.org/data/2.5/forecast?lat="+ lat + "&lon=" + lon + "&units=imperial&cnt=" + 40 + "&callback=?&APPID=" + APIKEY;
	//get 3H for the next 5 days
	ExtForecastURL = "http://api.openweathermap.org/data/2.5/forecast/daily?lat="+ lat + "&lon=" + lon +"&units=imperial&cnt=" + 15 + "&callback=?&APPID=" + APIKEY;
	//get current weather



	 $.getJSON( WeatherURL)
    .done(function( data ) {

    	appendCurrentWeather(data);
    	
        //DEBUG
    	//console.log(data);
    });

     $.getJSON( ThreeHForecastURL)
    .done(function( data ) {
    	
        var parent_index = 0;


                for(var i =0; i < data.cnt; i++){
                    //Parent_index identifies the group
                    if(i != 0 && i % 7 == 0){
                        parent_index++;

                    }   
                   
                    appendThreeHData(data, parent_index, i); 
                }
    	
      

    });


     $.getJSON( ExtForecastURL)
    .done(function( data ) {
        //add containers for the ThreeH to be appened to
        $("#Forecast").append( "<div class = 'collapse' id = 'ThreeH_Group_0'> </div> ");
        $("#Forecast").append( "<div class = 'collapse' id = 'ThreeH_Group_1'> </div> ");
        $("#Forecast").append( "<div class = 'collapse' id = 'ThreeH_Group_2'> </div> ");
        $("#Forecast").append( "<div class = 'collapse' id = 'ThreeH_Group_3'> </div> ");
        $("#Forecast").append( "<div class = 'collapse' id = 'ThreeH_Group_4'> </div> ");
        $("#Forecast").append( "<div class = 'collapse' id = 'ThreeH_Group_5'> </div> ");
    	$( document ).on(runner(data) );
    	
    	
    	
    });
}



function locationRequest(){
//get Geolocation data

	if (navigator.geolocation) {
	//Make sure we can get geolocation					
	   // Get the user's current position       success & error call backs, options
	   navigator.geolocation.getCurrentPosition(getWeather, showError);
	} else {
		alert('Geolocation is not supported in your browser');
	}

}