var searchFormEl = document.querySelector("#user-form");
var searchInputEl = document.querySelector("#city-search");
var currentWeatherEl = document.querySelector("#current-weather");
var futureWeatherEl = document.querySelector("#future-weather");

// Function to capture users search criteria and resets the input field 
var searchFormSubmitHandler = function (event) {
    event.preventDefault();

    // get value from input element
    var citySearch = searchInputEl.value.trim();

    if (citySearch) {
        getCurrentCityWeatherData(citySearch);
        // clear old content
        currentWeatherEl.textContent = "";
        searchInputEl.value = "";
    }
    else {
        alert("Please enter a valid city.") // change from alert to modal 
    }
};

// Function to fetch current weather conditions for users input
var getCurrentCityWeatherData = function (citySearch) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + citySearch + "&appid=e5755677cedd310e2759e54b55933d69";

    // make a request to the url
    fetch(apiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json()
                    .then(function (data) {
                        console.log(data);
                        displayCurrentWeather(data);
                    });
            } else {
                alert("Error: City not found");
            }
        })
        .catch(function (error) {
            alert("unable to connect to Weather");
        });
};

var displayCurrentWeather = function (currentWeather) {

    // Current date
    var currentDay = moment().format('(MM/DD/YYYY)');

    // Weather Icon Fetch
    var iconCode = currentWeather.weather[0].icon;
    var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + ".png";
    var currentWeatherIconLocation = document.createElement("img");
    currentWeatherIconLocation.setAttribute("src", iconUrl);

    // City Name
    var cityName = document.createElement("h3");
    cityName.textContent = currentWeather.name + " " + currentDay;

    // Temperature in Celsius
    var currentTemp = document.createElement("p");
    currentTemp.textContent = "Temp: " + Math.round(currentWeather.main.temp + (-273.15));

    // Wind Speed
    var currentWind = document.createElement("p");
    currentWind.textContent = "Wind: " + Math.round(currentWeather.wind.speed * 2.2369) + " MPH";

    // Humidity
    var currentHum = document.createElement("p");
    currentHum.textContent = "Humidity: " + currentWeather.main.humidity + "%";

     // UV Index
    var cityLon = currentWeather.coord.lon;
    var cityLat = currentWeather.coord.lat;
    var uvIndexUrl = "http://api.openweathermap.org/v3/uvi/" + cityLat + "," + cityLon + "/?appid=e5755677cedd310e2759e54b55933d69";
    console.log(uvIndexUrl);

    // Append data to page 
    currentWeatherEl.appendChild(cityName);
    currentWeatherEl.appendChild(currentWeatherIconLocation);
    currentWeatherEl.appendChild(currentTemp);
    currentWeatherEl.appendChild(currentWind);
    currentWeatherEl.appendChild(currentHum);

};





searchFormEl.addEventListener("submit", searchFormSubmitHandler);