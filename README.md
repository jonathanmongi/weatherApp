# Weather App

A small browser-based weather dashboard. Search for a city to retrieve its current temperature, description, icon, and a matching background from the OpenWeatherMap API.

## Run locally

1. Copy the configuration template:

   ```bash
   cp config.example.js config.js
   ```

2. Add an OpenWeatherMap API key to `config.js`.
3. Start a local server from the project directory:

   ```bash
   python3 -m http.server 8000
   ```

4. Open <http://localhost:8000/storm.html>.

The API key is loaded from the ignored local `config.js` file. Do not commit credentials. The browser still exposes a client-side key at runtime, so a production version should use a server-side proxy and provider-side key restrictions.

## Project structure

- `storm.html` contains the page structure and controls.
- `script.js` handles search events, API requests, rendering, errors, and weather-based backgrounds.
- `style.css` contains the visual design and responsive layout rules.
- `config.example.js` documents the local configuration shape.
- `CONTRIBUTING.md` explains setup, testing, and contribution workflow.

## What I learned

This project demonstrates asynchronous JavaScript with `fetch`, DOM updates, user input handling, API error states, and a small data-driven UI. It is intentionally dependency-free so the browser workflow is easy to inspect.
