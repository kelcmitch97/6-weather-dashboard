var searchFormEl = document.querySelector("#user-form");
var searchInputEl = document.querySelector("#city-search");
var currentWeatherEl = document.querySelector("#current-weather");
var futureWeatherEl = document.querySelector("#future-weather");

// Current Weather Container
var currentWeatherContainerEl = document.createElement("div");
currentWeatherEl.appendChild(currentWeatherContainerEl);


var searchFormSubmitHandler = function(event) {
    event.preventDefault();

    // get value from input element
    var citySearch = searchInputEl.value.trim();

    if (citySearch) {
        getCurrentCityWeatherData(citySearch);

        // clear old content
        currentWeatherContainerEl.textContent = "";
        searchInputEl.value = "";
    }
    else {
       alert("Please enter a valid city.")
    }
};

var getCurrentCityWeatherData = function(citySearch) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + citySearch + "&appid=e5755677cedd310e2759e54b55933d69";

    // make a request to the url
    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        
    })
}





searchFormEl.addEventListener("submit", searchFormSubmitHandler);