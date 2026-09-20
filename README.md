# Weather App

A small browser-based weather dashboard. Search for a city to retrieve its current temperature, description, icon, and a matching background from the Open-Meteo API.

**Live site:** <https://jonathanmongi.github.io/weatherApp/>

## Run locally

1. Start a local server from the project directory:

   ```bash
   python3 -m http.server 8000
   ```

2. Open <http://localhost:8000/storm.html>.

The public app does not require an API key. It first uses Open-Meteo's geocoding endpoint to resolve a city, then requests current conditions from its forecast endpoint. The initial dashboard is labeled demo mode until a search is performed.

## Project structure

- `storm.html` contains the page structure and controls.
- `script.js` handles search events, API requests, rendering, errors, and weather-based backgrounds.
- `style.css` contains the visual design and responsive layout rules.
- `CONTRIBUTING.md` explains setup, testing, and contribution workflow.

## What I learned

This project demonstrates asynchronous JavaScript with `fetch`, city geocoding, DOM updates, user input handling, API error states, and weather-based backgrounds. It is intentionally dependency-free so the browser workflow is easy to inspect.

Weather data is provided by [Open-Meteo](https://open-meteo.com/), which is available without an API key for non-commercial use. Location results are based on the GeoNames database.
