// Variable Declaration
var searchFormEl = document.querySelector("#user-form");
var searchInputEl = document.querySelector("#city-search");
var currentWeatherEl = document.querySelector("#current-weather");
var futureWeatherEl = document.querySelector("#future-weather");

// Forecast Weather Declarations
var forecastTitleEl = document.querySelector(".forecast-title");
var forecastDayOneEl = document.querySelector("#forecast-day-one");
var forecastDayTwoEl = document.querySelector("#forecast-day-two");
var forecastDayThreeEl = document.querySelector("#forecast-day-three");
var forecastDayFourEl = document.querySelector("#forecast-day-four");
var forecastDayFiveEl = document.querySelector("#forecast-day-five");

// Variable to store city searches
var citySearch = "";
var savedCities = [];

// Variable for API key
var APIkey = "e5755677cedd310e2759e54b55933d69";
var cityLon;
var cityLat;

// Function to capture users search criteria and resets the input field 
var searchFormSubmitHandler = function (event) {
    event.preventDefault();

    // get value from input element
    citySearch = searchInputEl.value.trim();

    if (citySearch) {
        getCityWeatherData(citySearch);
        // clear old content
        currentWeatherEl.textContent = "";
        searchInputEl.value = "";
    }
    else {
        alert("Please enter a valid city.") // change from alert to modal 
    }

};

// Function to fetch current weather conditions for users input
var getCityWeatherData = function (citySearch) {
    // OpenWeather API call to retrieve data from server
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + citySearch + "&appid=" + APIkey;

    // make a request to the apiUrl
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
    currentTemp.textContent = "Temp: " + Math.round(currentWeather.main.temp + (-273.15)) + "°C";

    // Wind Speed
    var currentWind = document.createElement("p");
    currentWind.textContent = "Wind: " + Math.round(currentWeather.wind.speed * 2.2369) + " MPH";

    // Humidity
    var currentHum = document.createElement("p");
    currentHum.textContent = "Humidity: " + currentWeather.main.humidity + "%";

    // UV Index
    cityLon = currentWeather.coord.lon;
    cityLat = currentWeather.coord.lat;
    // Calls function to get UV Index
    getUvIndex(cityLon, cityLat);
    getFiveDayForecast(cityLon, cityLat);

    // Append data to page 
    currentWeatherEl.appendChild(cityName);
    currentWeatherEl.appendChild(currentWeatherIconLocation);
    currentWeatherEl.appendChild(currentTemp);
    currentWeatherEl.appendChild(currentWind);
    currentWeatherEl.appendChild(currentHum);

};

// Function to return UV Index
var getUvIndex = function (cityLon, cityLat) {
    // Get UVIndex API
    var uvIndexApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&appid=" + APIkey;

    fetch(uvIndexApi)
        .then(function (response) {
            if (response.ok) {
                response.json()
                    .then(function (data) {
                        console.log(data);
                        var currentUvIndex = document.createElement("p");
                        var currentUvIndexValue = document.createElement("span");
                        currentUvIndex.textContent = "UV Index: ";
                        currentUvIndexValue.textContent = data.current.uvi;
                        currentUvIndex.appendChild(currentUvIndexValue);
                        currentWeatherEl.appendChild(currentUvIndex);
                    });
            }
        });


};

// Function to get 5 Day Forecast
var getFiveDayForecast = function (cityLon, cityLat) {
    // get 5 day forecast
    var forecastApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&appid=" + APIkey;

    // make request to forecastAPI
    fetch(forecastApi)
        .then(function (response) {
            if (response.ok) {
                response.json()
                    .then(function (data) {

                        futureWeatherEl.classList.remove("hidden");

                        // Temperature in Celsius

                        var forecastDayOneTemp = document.createElement("p");
                        forecastDayOneTemp.textContent = "Temp: " + Math.round(data.daily[0].temp.day + (-273.15)) + "°C";
                        forecastDayOne.appendChild(forecastDayOneTemp);

                    });
            }
        });

};




// Event Listener on the search form button to trigger the functions that handle displaying the weather data
searchFormEl.addEventListener("submit", searchFormSubmitHandler);
