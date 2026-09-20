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
const weatherMode = document.getElementById("weather-mode");

const weatherCodes = {
  0: ["Clear sky", "Clear", "☀️"],
  1: ["Mainly clear", "Clear", "🌤️"],
  2: ["Partly cloudy", "Clouds", "⛅"],
  3: ["Overcast", "Clouds", "☁️"],
  45: ["Foggy", "Clouds", "🌫️"],
  48: ["Rime fog", "Clouds", "🌫️"],
  51: ["Light drizzle", "Rain", "🌦️"],
  53: ["Drizzle", "Rain", "🌦️"],
  55: ["Heavy drizzle", "Rain", "🌧️"],
  61: ["Light rain", "Rain", "🌦️"],
  63: ["Rain", "Rain", "🌧️"],
  65: ["Heavy rain", "Rain", "🌧️"],
  71: ["Light snow", "Snow", "🌨️"],
  73: ["Snow", "Snow", "❄️"],
  75: ["Heavy snow", "Snow", "❄️"],
  80: ["Rain showers", "Rain", "🌦️"],
  81: ["Rain showers", "Rain", "🌧️"],
  82: ["Heavy showers", "Rain", "🌧️"],
  95: ["Thunderstorm", "Thunderstorm", "⛈️"],
  96: ["Thunderstorm with hail", "Thunderstorm", "⛈️"],
  99: ["Thunderstorm with hail", "Thunderstorm", "⛈️"],
};

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (city) fetchWeather(city);
});

async function fetchWeather(city) {
  setLoading(true);
  try {
    const locationResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
    );
    if (!locationResponse.ok) throw new Error("Location lookup failed");
    const locationData = await locationResponse.json();
    const location = locationData.results?.[0];

    if (!location) {
      showError("We couldn't find that city. Check the spelling and try again.");
      return;
    }

    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&temperature_unit=celsius&wind_speed_unit=kmh&timezone=auto`
    );
    if (!weatherResponse.ok) throw new Error("Weather lookup failed");
    const weatherData = await weatherResponse.json();
    renderWeather(location, weatherData.current);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    showError("The weather service is unavailable right now. Please try again.");
  } finally {
    setLoading(false);
  }
}

function renderWeather(location, current) {
  const [description, background, emoji] = weatherCodes[current.weather_code] || ["Current conditions", "Clear", "🌤️"];
  cityName.textContent = location.country ? `${location.name}, ${location.country_code}` : location.name;
  temperature.textContent = Math.round(current.temperature_2m);
  weatherDescription.textContent = description;
  feelsLike.textContent = `${Math.round(current.apparent_temperature)}°C`;
  humidity.textContent = `${current.relative_humidity_2m}%`;
  windSpeed.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
  weatherIcon.src = createWeatherIcon(emoji);
  weatherIcon.alt = description;
  weatherIcon.hidden = false;
  weatherMode.textContent = "LIVE";
  weatherInfo.classList.remove("hidden");
  errorMessage.classList.add("hidden");
  statusMessage.textContent = "Updated just now · Search another city anytime.";
  changeBackground(background);
}

function createWeatherIcon(emoji) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="72" text-anchor="middle" font-size="68">${emoji}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function setLoading(isLoading) {
  searchBtn.disabled = isLoading;
  searchBtn.innerHTML = isLoading ? "Loading…" : 'Search <span aria-hidden="true">→</span>';
  if (isLoading) statusMessage.textContent = "Reading the sky…";
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

function showDemoWeather() {
  const location = { name: "Nairobi", country_code: "KE" };
  const current = {
    temperature_2m: 23,
    apparent_temperature: 24,
    relative_humidity_2m: 61,
    wind_speed_10m: 14,
    weather_code: 2,
  };
  renderWeather(location, current);
  weatherMode.textContent = "DEMO";
  statusMessage.textContent = "Preview mode · Search any city for live conditions.";
}

showDemoWeather();
