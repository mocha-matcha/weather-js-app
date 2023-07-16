var apiKey = "0de2555e66d464c3332534da49cd8378";
var currentWeatherData = [];
var currentCity = "";

$(function () {
  const getLatLonData = async (lat, lon) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );

    const posts = await response.json();

    console.log(posts);
    return posts;
  };

  const search = async (city) => {
    fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`
    )
      .then(function (response) {
        return response.json();
      })
      .then(async function (data) {
        let latLon = await getLatLonData(data[0]["lat"], data[0]["lon"]);
        currentWeatherData = await getWeatherData(latLon);

        loadCityDataElement(city);

        let time = dayjs();

        let button = $(
          `<button class="weather-button" id="${city}">${city}</button>`
        );

        button.on("click", function () {
          populateWeatherUi(city);
        });
        $("#cities").append(button);

        cleanButtons();

        populateWeatherUi(city);
      });
  };

  const cleanButtons = () => {
    let seen = {};
    $("#cities").children().each(function () {
      var txt = $(this).text();
      if (seen[txt]) $(this).remove();
      else seen[txt] = true;
    });
  };

  const getWeatherData = async (data) => {
    console.log(data);
    let arr = [
      data["list"][0],
      data["list"][6],
      data["list"][14],
      data["list"][22],
      data["list"][30],
    ];

    return arr;
  };

  const getWeatherCardElement = (weatherData) => {
    let elementText = `<div class="weather-card">
  <h2 class="date">(Date) 11/23/24</h2>
  <div>
      <img class="weather-icon" src="./assets/amcharts_weather_icons_1.0.0/static/cloudy-day-1.svg" alt="">
      <h3 class="temp-text">Temp</h3>
      <h3 class="wind-text">Wind</h3>
      <h4 class="wind-deg">Wind</h4>
      <h4 class="wind-gust">Wind</h4>
      <h4 class="wind-speed">Wind</h4>
      <h3 class="humid-text">Humidity</h3>
  </div>
</div>`;

    let element = $(elementText);
    element
      .find(".date")
      .text(dayjs.unix(weatherData["dt"]).format("MM/DD/YY"));

    element
      .find(".weather-icon")
      .attr(
        "src",
        `https://openweathermap.org/img/wn/${weatherData["weather"][0]["icon"]}@2x.png`
      );

    element
      .find(".temp-text")
      .text("Temp: " + weatherData["main"]["temp"] + "\n");
    element.find(".wind-deg").text("Deg: " + weatherData["wind"]["deg"]);
    element.find(".wind-gust").text("Gust: " + weatherData["wind"]["gust"]);
    element.find(".wind-speed").text("Speed: " + weatherData["wind"]["speed"]);
    element
      .find(".humid-text")
      .text("Humidity: " + weatherData["main"]["humidity"]);

    return element;
  };

  const clearWeather = () => {
    $("#weather").empty();
  };

  const loadCityDataElement = async (city) => {
    clearWeather();
    console.log(city);
    let weatherData = currentWeatherData;
    console.log(weatherData);

    for (let index = 0; index < weatherData.length; index++) {
      const element = getWeatherCardElement(weatherData[index]);
      $("#weather").append(element);
    }
    let savedHtml = $("#weather").html();
    localStorage.setItem(city, savedHtml);
    console.log("finished load");
  };

  const populateWeatherUi = (city) => {
    clearWeather();

    console.log(city);
    let potentialHtml = localStorage.getItem(city);
    if (potentialHtml) {
      $("#weather").append(potentialHtml);
    }
  };

  $("#search-button").on("click", function () {
    search($("#search").val());
  });
});
