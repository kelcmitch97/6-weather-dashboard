// Variable Declaration
var searchFormEl = document.querySelector("#user-form");
var searchInputEl = document.querySelector("#city-search");
var currentWeatherEl = document.querySelector("#current-weather");
var futureWeatherEl = document.querySelector("#future-weather");
var searchHistoryContainerEl = document.querySelector("#search-history");

// Forecast Weather Declarations
var forecastDayOneEl = document.querySelector("#forecast-day-one");
var forecastDayTwoEl = document.querySelector("#forecast-day-two");
var forecastDayThreeEl = document.querySelector("#forecast-day-three");
var forecastDayFourEl = document.querySelector("#forecast-day-four");
var forecastDayFiveEl = document.querySelector("#forecast-day-five");

// Variable to store city searches
var cities = [];

// Variable for API key
var APIkey = "e5755677cedd310e2759e54b55933d69";
var cityLon;
var cityLat;

displaySearchHistory();


// Clear Search History button
function clearSearchHistory() {
    searchHistoryContainerEl.innerHTML = "";
    cities = [];
    window.localStorage.clear();
 

}

// Show search history
function displaySearchHistory() {
    // Get stored cities from localStorage
    var savedCities = JSON.parse(localStorage.getItem("cities"));

    if (savedCities !== null) {
        cities = savedCities;
    }
    getCities();
};

// Store search history
function saveCities() {
    localStorage.setItem("cities", JSON.stringify(cities));
    console.log(localStorage);
};

// Get search history from storage
function getCities() {

    searchHistoryContainerEl.textContent = "";

    for (var i = 0; i < cities.length; i++) {
        var city = cities[i];

        var cityList = document.createElement("li");
        cityList.textContent = city;
        cityList.setAttribute("id", "list-of-cities");
        cityList.setAttribute("data-city", city);
        cityList.setAttribute("class", "list-group-item");
        searchHistoryContainerEl.appendChild(cityList);
    }
};

// Display the past search when the city in the search history is clicked
var searchHistoryHandler = function (event) {
    event.preventDefault();
    var cityList = event.target;

    if (event.target.matches("li")) {
        currentWeatherEl.textContent = ""; // resets current weather display
        citySearch = cityList.textContent.trim();
        getCityWeatherData(citySearch);
    }
};

// Function to capture users search criteria and resets the input field 
var searchFormSubmitHandler = function (event) {
    event.preventDefault();

    // get value from input element
    citySearch = searchInputEl.value.trim();

    if (citySearch) {

        getCityWeatherData(citySearch);
        currentWeatherEl.textContent = "";
        searchInputEl.value = "";

        if (cities.indexOf(citySearch) == -1) {
            citySearch = citySearch.charAt(0).toUpperCase() + citySearch.slice(1);
            cities.unshift(citySearch); // Add city search to cities array 
            saveCities();
            getCities();
        }

    }
    else {
        alert("Please enter a valid city.");
    }

};

// Function to fetch current weather conditions for users input
var getCityWeatherData = function (citySearch) {
    console.log("Here");
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
                        getUvIndexColor(currentUvIndexValue);
                    });
            }
        });
};

function getUvIndexColor(currentUvIndexValue) {
    var uvColor = currentUvIndexValue.textContent;

    if (uvColor < 2) {
        currentUvIndexValue.classList.add("low");
    } else if (uvColor < 5) {
        currentUvIndexValue.classList.add("moderate");
    } else if (uvColor < 10) {
        currentUvIndexValue.classList.add("high");
    } else if (uvColor < 11) {
        currentUvIndexValue.classList.add("extreme");
    }
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

                        forecastDayOneEl.innerHTML = "";
                        // Day1 Date \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
                        var forecastDayOneDate = document.createElement("h5");
                        forecastDayOneDate.textContent = moment().add(1, "d").format("M/DD/YYYY"),
                        forecastDayOneEl.appendChild(forecastDayOneDate);
                        // Day1 Icon
                        var iconCode1 = data.daily[0].weather[0].icon;
                        var iconUrl1 = "http://openweathermap.org/img/wn/" + iconCode1 + ".png";
                        var dayOneWeatherIconLocation = document.createElement("img");
                        dayOneWeatherIconLocation.setAttribute("src", iconUrl1);
                        forecastDayOneEl.appendChild(dayOneWeatherIconLocation);
                        // Day1 Temp
                        var forecastDayOneTemp = document.createElement("p");
                        forecastDayOneTemp.textContent = "Temp: " + Math.round(data.daily[0].temp.day + (-273.15)) + "°C";
                        forecastDayOneEl.appendChild(forecastDayOneTemp);
                        // Day1 Wind
                        var forecastDayOneWind = document.createElement("p");
                        forecastDayOneWind.textContent = "Wind: " + Math.round(data.daily[0].wind_speed * 2.2369) + " MPH";
                        forecastDayOneEl.appendChild(forecastDayOneWind);
                        // Day1 Humidity
                        var forecastDayOneHumidity = document.createElement("p");
                        forecastDayOneHumidity.textContent = "Humidity: " + data.daily[0].humidity + "%";
                        forecastDayOneEl.appendChild(forecastDayOneHumidity);

                        forecastDayTwoEl.innerHTML = "";
                        // Day2 Date \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
                        var forecastDayTwoDate = document.createElement("h5");
                        forecastDayTwoDate.textContent = moment().add(2, "d").format("M/DD/YYYY"),
                            forecastDayTwoEl.appendChild(forecastDayTwoDate);
                        // Day2 Icon
                        var iconCode2 = data.daily[1].weather[0].icon;
                        var iconUrl2 = "http://openweathermap.org/img/wn/" + iconCode2 + ".png";
                        var dayTwoWeatherIconLocation = document.createElement("img");
                        dayTwoWeatherIconLocation.setAttribute("src", iconUrl2);
                        forecastDayTwoEl.appendChild(dayTwoWeatherIconLocation);
                        // Day2 Temp
                        var forecastDayTwoTemp = document.createElement("p");
                        forecastDayTwoTemp.textContent = "Temp: " + Math.round(data.daily[1].temp.day + (-273.15)) + "°C";
                        forecastDayTwoEl.appendChild(forecastDayTwoTemp);
                        // Day2 Wind
                        var forecastDayTwoWind = document.createElement("p");
                        forecastDayTwoWind.textContent = "Wind: " + Math.round(data.daily[1].wind_speed * 2.2369) + " MPH";
                        forecastDayTwoEl.appendChild(forecastDayTwoWind);
                        // Day2 Humidity
                        var forecastDayTwoHumidity = document.createElement("p");
                        forecastDayTwoHumidity.textContent = "Humidity: " + data.daily[1].humidity + "%";
                        forecastDayTwoEl.appendChild(forecastDayTwoHumidity);

                        forecastDayThreeEl.innerHTML = "";
                        // Day3 Date \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
                        var forecastDayThreeDate = document.createElement("h5");
                        forecastDayThreeDate.textContent = moment().add(3, "d").format("M/DD/YYYY"),
                            forecastDayThreeEl.appendChild(forecastDayThreeDate);
                        // Day3 Icon
                        var iconCode3 = data.daily[2].weather[0].icon;
                        var iconUrl3 = "http://openweathermap.org/img/wn/" + iconCode3 + ".png";
                        var dayThreeWeatherIconLocation = document.createElement("img");
                        dayThreeWeatherIconLocation.setAttribute("src", iconUrl3);
                        forecastDayThreeEl.appendChild(dayThreeWeatherIconLocation);
                        // Day3 Temp
                        var forecastDayThreeTemp = document.createElement("p");
                        forecastDayThreeTemp.textContent = "Temp: " + Math.round(data.daily[2].temp.day + (-273.15)) + "°C";
                        forecastDayThreeEl.appendChild(forecastDayThreeTemp);
                        // Day3 Wind
                        var forecastDayThreeWind = document.createElement("p");
                        forecastDayThreeWind.textContent = "Wind: " + Math.round(data.daily[2].wind_speed * 2.2369) + " MPH";
                        forecastDayThreeEl.appendChild(forecastDayThreeWind);
                        // Day3 Humidity
                        var forecastDayThreeHumidity = document.createElement("p");
                        forecastDayThreeHumidity.textContent = "Humidity: " + data.daily[2].humidity + "%";
                        forecastDayThreeEl.appendChild(forecastDayThreeHumidity);

                        forecastDayFourEl.innerHTML = "";
                        // Day4 Date \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
                        var forecastDayFourDate = document.createElement("h5");
                        forecastDayFourDate.textContent = moment().add(4, "d").format("M/DD/YYYY"),
                            forecastDayFourEl.appendChild(forecastDayFourDate);
                        // Day4 Icon
                        var iconCode4 = data.daily[3].weather[0].icon;
                        var iconUrl4 = "http://openweathermap.org/img/wn/" + iconCode4 + ".png";
                        var dayFourWeatherIconLocation = document.createElement("img");
                        dayFourWeatherIconLocation.setAttribute("src", iconUrl3);
                        forecastDayFourEl.appendChild(dayFourWeatherIconLocation);
                        // Day4 Temp
                        var forecastDayFourTemp = document.createElement("p");
                        forecastDayFourTemp.textContent = "Temp: " + Math.round(data.daily[3].temp.day + (-273.15)) + "°C";
                        forecastDayFourEl.appendChild(forecastDayFourTemp);
                        // Day4 Wind
                        var forecastDayFourWind = document.createElement("p");
                        forecastDayFourWind.textContent = "Wind: " + Math.round(data.daily[3].wind_speed * 2.2369) + " MPH";
                        forecastDayFourEl.appendChild(forecastDayFourWind);
                        // Day4 Humidity
                        var forecastDayFourHumidity = document.createElement("p");
                        forecastDayFourHumidity.textContent = "Humidity: " + data.daily[3].humidity + "%";
                        forecastDayFourEl.appendChild(forecastDayFourHumidity);

                        forecastDayFiveEl.innerHTML = "";
                        // Day5 Date \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
                        var forecastDayFiveDate = document.createElement("h5");
                        forecastDayFiveDate.textContent = moment().add(5, "d").format("M/DD/YYYY"),
                            forecastDayFiveEl.appendChild(forecastDayFiveDate);
                        // Day5 Icon
                        var iconCode5 = data.daily[4].weather[0].icon;
                        var iconUrl5 = "http://openweathermap.org/img/wn/" + iconCode5 + ".png";
                        var dayFiveWeatherIconLocation = document.createElement("img");
                        dayFiveWeatherIconLocation.setAttribute("src", iconUrl3);
                        forecastDayFiveEl.appendChild(dayFiveWeatherIconLocation);
                        // Day5 Temp
                        var forecastDayFiveTemp = document.createElement("p");
                        forecastDayFiveTemp.textContent = "Temp: " + Math.round(data.daily[4].temp.day + (-273.15)) + "°C";
                        forecastDayFiveEl.appendChild(forecastDayFiveTemp);
                        // Day5 Wind
                        var forecastDayFiveWind = document.createElement("p");
                        forecastDayFiveWind.textContent = "Wind: " + Math.round(data.daily[4].wind_speed * 2.2369) + " MPH";
                        forecastDayFiveEl.appendChild(forecastDayFiveWind);
                        // Day5 Humidity
                        var forecastDayFiveHumidity = document.createElement("p");
                        forecastDayFiveHumidity.textContent = "Humidity: " + data.daily[4].humidity + "%";
                        forecastDayFiveEl.appendChild(forecastDayFiveHumidity);

                    });
            }
        });

};


// Event Listener on the search form button to trigger the functions that handle displaying the weather data
searchFormEl.addEventListener("submit", searchFormSubmitHandler);
searchFormEl.addEventListener("reset", clearSearchHistory);
$(searchHistoryContainerEl).on("click", searchHistoryHandler);
