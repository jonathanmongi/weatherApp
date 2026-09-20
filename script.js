const apiKey = window.WEATHER_API_KEY || "";
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const cityName = document.getElementById("city-name");
const weatherIcon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const weatherDescription = document.getElementById("weather-description");
const weatherInfo = document.getElementById("weather-info");
const errorMessage = document.getElementById("error-message");

async function fetchWeather(city) {
  if (!apiKey) {
    showError("Add your OpenWeatherMap API key to config.js before searching.");
    return;
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();

    if (!response.ok || data.cod !== 200) {
      showError("City not found. Please try again.");
      return;
    }

    cityName.textContent = data.name;
    temperature.textContent = `Temperature: ${data.main.temp}°C`;
    weatherDescription.textContent = `Weather: ${data.weather[0].description}`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIcon.hidden = false;

    weatherInfo.classList.remove("hidden");
    errorMessage.classList.add("hidden");
    changeBackground(data.weather[0].main);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    showError("Unable to reach the weather service. Please try again.");
  }
}

function changeBackground(weatherCondition) {
  const backgrounds = {
    Clear: "linear-gradient(135deg, #ff9a9e, #fad0c4)",
    Clouds: "linear-gradient(135deg, #757F9A, #D7DDE8)",
    Rain: "linear-gradient(135deg, #005C97, #363795)",
    Snow: "linear-gradient(135deg, #E0EAFC, #CFDEF3)",
    Thunderstorm: "linear-gradient(135deg, #2C3E50, #4CA1AF)",
  };

  document.body.style.background =
    backgrounds[weatherCondition] || backgrounds.Clear;
}

function showError(message) {
  weatherInfo.classList.add("hidden");
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
}

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) fetchWeather(city);
});

cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") searchBtn.click();
});
