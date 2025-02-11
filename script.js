const apiKey = "924567a9debaf81635511b152d054606"; // Your OpenWeatherMap API key
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const cityName = document.getElementById("city-name");
const weatherIcon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const weatherDescription = document.getElementById("weather-description");
const weatherInfo = document.getElementById("weather-info");
const errorMessage = document.getElementById("error-message");

// Function to fetch weather
async function fetchWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();

    if (data.cod === 200) {
      cityName.textContent = data.name;
      temperature.textContent = `🌡 Temperature: ${data.main.temp}°C`;
      weatherDescription.textContent = `🌍 Weather: ${data.weather[0].description}`;
      weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

      // Show weather info
      weatherInfo.classList.remove("hidden");
      errorMessage.classList.add("hidden");

      // Change background based on weather
      changeBackground(data.weather[0].main);
    } else {
      showError();
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    showError();
  }
}

// Function to change background dynamically
function changeBackground(weatherCondition) {
  let bg;
  switch (weatherCondition) {
    case "Clear":
      bg = "linear-gradient(135deg, #ff9a9e, #fad0c4)";
      break;
    case "Clouds":
      bg = "linear-gradient(135deg, #757F9A, #D7DDE8)";
      break;
    case "Rain":
      bg = "linear-gradient(135deg, #005C97, #363795)";
      break;
    case "Snow":
      bg = "linear-gradient(135deg, #E0EAFC, #CFDEF3)";
      break;
    case "Thunderstorm":
      bg = "linear-gradient(135deg, #2C3E50, #4CA1AF)";
      break;
    default:
      bg = "linear-gradient(135deg, #ff9a9e, #fad0c4)";
  }
  document.body.style.background = bg;
}

// Function to show error
function showError() {
  weatherInfo.classList.add("hidden");
  errorMessage.classList.remove("hidden");
}

// Event listeners
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
  }
});

// Search on "Enter" key press
cityInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchBtn.click();
  }
});

