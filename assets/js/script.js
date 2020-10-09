  var apiKey = "2a24cb245fb54c82b434c69da084d78f";
  var currentSummary = $(".current-summary");
  var currentTemp = $(".current-temp");
  var currentHumidity = $(".current-humidity");
  var currentWind = $(".current-wind");
  var currentUV = $(".current-uv");
  var cityDisplayName = $(".city-name");
  var citiesArr = [];
  
  //Get Local Storage
  var citiesArrStorage = localStorage.getItem("citiesArrStorage")
  if (citiesArrStorage !== null){
    citiesArr = JSON.parse(citiesArrStorage);
  }

  //Populates the main area with current weather data based on the incoming city
  function populateCity(cityName){
    var mainQuery = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey + "&units=imperial";
    console.log(cityName)
    cityDisplayName.text(cityName)
    $.ajax({
      url: mainQuery,
      method: "GET"
    }).then(function(response){
      console.log(response)
      currentTemp.text(response.main.temp);
      currentHumidity.text(response.main.humidity);
      currentWind.text(response.wind.speed)
      currentSummary.text(response.weather[0].description)
      var currentImg = $("<img>").attr("src","https://openweathermap.org/img/w/" + response.weather[0].icon + ".png")
      currentSummary.append(currentImg);
      var lat = response.coord.lat
      var lon = response.coord.lon
      var uvQuery = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
      $.ajax({
        url: uvQuery,
        method: "GET"
      }).then(function(response){
        console.log(response)
        var uvValue = response.value
        currentUV.text(uvValue)
        if (uvValue < 3){
          currentUV.css("background-color", "green")
        } if (uvValue > 3 && uvValue < 8){
          currentUV.css("background-color", "yellow")
        } if (uvValue > 8){
          currentUV.css("background-color", "red")
        }
      })
    })
    populateHistory(cityName);
    fiveDayForecast(cityName);
  }

  //Updates the array and pushes to local storage
  function populateHistory(cityName){
    if(!citiesArr.includes(cityName))
    citiesArr.push(cityName);
    localStorage.setItem("citiesArrStorage", JSON.stringify(citiesArr));
    $(".pastCities").empty();
     createButtons()
  } 

  //Creates the buttons of past search history
  function createButtons(){
    if (citiesArr){
      var pastSearchTitle = $("<h2>").text("Past Searches")
      $(".pastCities").append(pastSearchTitle)
      for (i=0; i < citiesArr.length; i++){
        var newButton = $("<button>");
        newButton.text(citiesArr[i])
        newButton.addClass("pastSearchCity")
        $(".pastCities").append(newButton)
      }
    }
  }

  //Creates the five day forecast information below the current weather
  function fiveDayForecast(cityName){
    fiveDayQuery = "https://api.openweathermap.org/data/2.5/forecast/daily?q=" + cityName + "&cnt=5&appid=166a433c57516f51dfab1f7edaed8413" + "&units=imperial";
    console.log(fiveDayQuery)
    $(".forecast-days").empty();
    $.ajax({
      url: fiveDayQuery,
      method: "GET"
    }).then(function(response){
      console.log(response)

      for (i=0; i<response.list.length; i++){
        var forecastDay = dayjs(response.list[i].dt)
        var forecastImg = "https://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png"
        var forecastTemp = response.list[i].temp.day
        var forecastHumidity = response.list[i].humidity
        var currentDayDiv = $(".day" + i)
        var forecastDayDisplay = $("<h3>").text(forecastDay)
        var forecastImgDisplay = $("<img>").attr("src", forecastImg)
        var forecastTempDisplay = $("<p>").text("Temperature: " + forecastTemp)
        var forecastHumidityDisplay = $("<p>").text("Humidity: " + forecastHumidity)
        currentDayDiv.append(forecastDayDisplay).append(forecastImgDisplay).append(forecastTempDisplay).append(forecastHumidityDisplay)
      }
    })
  }
  
  //Populate past searches on page load
  createButtons()

  //Runs weather for Denver
  populateCity("Denver")

  //User clicks on past history 
  $(".pastCities").on("click", ".pastSearchCity", function(e){
    e.preventDefault();
    var cityName = $(this).text()
    populateCity(cityName)
  })

  //User searches for a new city
  $(".submit").on("click", function(e){
    e.preventDefault();
    var cityName = $(".data-city-name").val();
    populateCity(cityName)
  })