const weatherApi = {
    key: '4eb3703790b356562054106543b748b2',
    baseUrl: 'https://api.openweathermap.org/data/2.5/weather'
  };
  
  document.addEventListener('DOMContentLoaded', () => {
    const inputBox = document.getElementById('input-box');
    const searchBtn = document.getElementById('search-btn');
    const weatherBody = document.getElementById('weather-body');
    const loading = document.getElementById('loading');
  
    searchBtn.addEventListener('click', () => {
      getWeatherReport(inputBox.value);
    });
  
    inputBox.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        getWeatherReport(inputBox.value);
      }
    });
  
    async function getWeatherReport(city) {
      if (city.trim() === "") {
        swal("Empty Input", "Please enter a city name.", "error");
        return;
      }
  
      try {
        showLoading(true);
        const response = await fetch(${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric);
        const weather = await response.json();
  
        if (weather.cod === "404") {
          swal("Bad Input", "City not found.", "warning");
          return;
        }
  
        showWeatherReport(weather);
      } catch (error) {
        swal("Error", "Unable to fetch weather data.", "error");
      } finally {
        showLoading(false);
      }
    }
  
    function showWeatherReport(weather) {
      const todayDate = new Date();
      weatherBody.innerHTML = `
        <div class="location-deatils">
          <div class="city" id="city">${weather.name}, ${weather.sys.country}</div>
          <div class="date" id="date"> ${dateManage(todayDate)}</div>
        </div>
        <div class="weather-status">
          <div class="temp" id="temp">${Math.round(weather.main.temp)}&deg;C </div>
          <div class="weather" id="weather"> ${weather.weather[0].main} <i class="${getIconClass(weather.weather[0].main)}"></i>  </div>
          <div class="min-max" id="min-max">${Math.floor(weather.main.temp_min)}&deg;C (min) / ${Math.ceil(weather.main.temp_max)}&deg;C (max) </div>
          <div id="updated_on">Updated as of ${getTime(todayDate)}</div>
        </div>
        <hr>
        <div class="day-details">
          <div class="basic">Feels like ${weather.main.feels_like}&deg;C | Humidity ${weather.main.humidity}%  <br> Pressure ${weather.main.pressure} mb | Wind ${weather.wind.speed} KMPH</div>
        </div>
      `;
      weatherBody.style.display = 'block';
      changeBg(weather.weather[0].main);
      reset();
    }
  
    function showLoading(isLoading) {
      loading.style.display = isLoading ? 'block' : 'none';
    }
  
    function getTime(todayDate) {
      const hour = addZero(todayDate.getHours());
      const minute = addZero(todayDate.getMinutes());
      return ${hour}:${minute};
    }
  
    function dateManage(dateArg) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const year = dateArg.getFullYear();
      const month = months[dateArg.getMonth()];
      const date = dateArg.getDate();
      const day = days[dateArg.getDay()];
      return ${date} ${month} (${day}) , ${year};
    }
  
    function changeBg(status) {
      const statusToBg = {
        'Clouds': 'url(img/clouds.jpg)',
        'Rain': 'url(img/rainy.jpg)',
        'Clear': 'url(img/clear.jpg)',
        'Snow': 'url(img/snow.jpg)',
        'Sunny': 'url(img/sunny.jpg)',
        'Thunderstorm': 'url(img/thunderstrom.jpg)',
        'Drizzle': 'url(img/drizzle.jpg)',
        'Mist': 'url(img/mist.jpg)',
        'Haze': 'url(img/mist.jpg)',
        'Fog': 'url(img/mist.jpg)'
      };
      document.body.style.backgroundImage = statusToBg[status] || 'url(img/bg.jpg)';
    }
  
    function getIconClass(weather) {
      const weatherToIcon = {
        'Rain': 'fas fa-cloud-showers-heavy',
        'Clouds': 'fas fa-cloud',
        'Clear': 'fas fa-cloud-sun',
        'Snow': 'fas fa-snowman',
        'Sunny': 'fas fa-sun',
        'Mist': 'fas fa-smog',
        'Thunderstorm': 'fas fa-thunderstorm',
        'Drizzle': 'fas fa-cloud-rain'
      };
      return weatherToIcon[weather] || 'fas fa-cloud-sun';
    }
  
    function addZero(i) {
      return i < 10 ? "0" + i : i;
    }
  
    function reset() {
      inputBox.value = "";
    }
  });
