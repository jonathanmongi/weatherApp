const apiKey = window.WEATHER_API_KEY || "";
const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const cityName = document.getElementById("city-name");
const weatherIcon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const weatherDescription = document.getElementById("weather-description");
const feelsLike = document.getElementById("feels-like");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const weatherInfo = document.getElementById("weather-info");
const errorMessage = document.getElementById("error-message");
const statusMessage = document.getElementById("status-message");

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (city) fetchWeather(city);
});

async function fetchWeather(city) {
  if (!apiKey) {
    showError("Add your OpenWeatherMap key to config.js before searching.");
    return;
  }

  setLoading(true);
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();

    if (!response.ok || data.cod !== 200) {
      showError("We couldn't find that city. Check the spelling and try again.");
      return;
    }

    cityName.textContent = data.name;
    temperature.textContent = Math.round(data.main.temp);
    weatherDescription.textContent = data.weather[0].description;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
    weatherIcon.hidden = false;

    weatherInfo.classList.remove("hidden");
    errorMessage.classList.add("hidden");
    statusMessage.textContent = "Updated just now · Search another city anytime.";
    changeBackground(data.weather[0].main);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    showError("The weather service is unavailable right now. Please try again.");
  } finally {
    setLoading(false);
  }
}

function setLoading(isLoading) {
  searchBtn.disabled = isLoading;
  searchBtn.innerHTML = isLoading ? "Loading…" : 'Search <span aria-hidden="true">→</span>';
  statusMessage.textContent = isLoading ? "Reading the sky…" : statusMessage.textContent;
}

function changeBackground(weatherCondition) {
  const backgrounds = {
    Clear: "radial-gradient(circle at 80% 5%, #f2db9c 0, transparent 32%), #f4f2ec",
    Clouds: "radial-gradient(circle at 80% 5%, #c9d2d4 0, transparent 32%), #f4f2ec",
    Rain: "radial-gradient(circle at 80% 5%, #a9c4ce 0, transparent 32%), #e8eeee",
    Snow: "radial-gradient(circle at 80% 5%, #d6e3e8 0, transparent 32%), #f4f6f3",
    Thunderstorm: "radial-gradient(circle at 80% 5%, #a9a7bc 0, transparent 32%), #e9e7ed",
  };
  document.body.style.background = backgrounds[weatherCondition] || backgrounds.Clear;
}

function showError(message) {
  weatherInfo.classList.add("hidden");
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
  statusMessage.textContent = "Something needs your attention.";
}
