Solomon Mori: Lab 2

Used the API located @ http://api.openweathermap.org/

Jumbotron contains current weather data, location, date and time, temperature, wind speed, cloud coverage and weather description.

Then comes the 5day forecast section containing the same type of info as the jumbotron. Mousing over and off brings toggle slides three hour data for that day.

The other days after the 5day forecast are cycled in the following section.


getUTCDay() sometimes returned the wrong day when it was close to midnight presumably due to daylights saving time, used getDay() instead.


Bugs:
Sometimes the application will have an error complaining that the dailydata cannot be indexed.
Toggleslide always causes color smearing that dissipates after the animation completes.
toggleslide will rarely show just a thin line while animiation.