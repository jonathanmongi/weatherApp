# Contributor onboarding guide

This guide explains how to run, understand, and safely change the **Weather App**. The project is a small static frontend: the browser loads one HTML page, applies one stylesheet, and executes one JavaScript file that calls the Open-Meteo geocoding and forecast APIs.

## Before you start

You need Git, a modern web browser, and a local HTTP server. No Node.js installation, package manager, dependency installation, or build step is currently required.

The public app does not require an API key. It resolves a city with Open-Meteo's geocoding endpoint and then requests current conditions from its forecast endpoint. This makes the static GitHub Pages deployment usable without storing credentials in the repository.

## Set up a local copy

Clone the repository and enter its directory:

```bash
git clone https://github.com/jonathanmongi/weatherApp.git
cd weatherApp
```

Start a local HTTP server from the repository root. Python is one option:

```bash
python3 -m http.server 8000
```

Open [http://localhost:8000/storm.html](http://localhost:8000/storm.html) in a browser. Use a local server rather than opening the HTML file directly so that browser networking and asset-loading behavior matches a normal web page.

To verify the current integration, search for a well-known city such as `London`. A successful response displays the city name, temperature in Celsius, a weather description, and an icon. An invalid city displays the error message.

## Project structure

The repository intentionally has a flat structure:

```text
weatherApp/
├── storm.html       # Page markup and element IDs used by JavaScript
├── style.css        # Layout, colors, typography, and visibility styles
├── script.js        # Search behavior, API request, rendering, and backgrounds
└── CONTRIBUTING.md  # This onboarding guide
```

There is no `package.json`, lockfile, test runner, bundler, or generated output. Keep changes compatible with a browser that supports modern JavaScript, `fetch`, and `async`/`await`.

## How the application works

`storm.html` is the entry point. It defines the search input and button, the hidden weather-results panel, the weather icon, and the error message. The IDs in this file are part of the JavaScript contract. If an ID changes, update the corresponding selector in `script.js` in the same change.

`script.js` obtains references to those elements and registers the search form. Submitting the form trims the input, resolves the city, and requests current weather in metric units. A successful response updates the page and calls `changeBackground` with the mapped WMO weather condition. A failed request or missing location calls `showError`. When the page first loads, it shows a clearly labeled demo state until a search is performed.

`changeBackground` maps broad conditions such as `Clear`, `Clouds`, `Rain`, `Snow`, and `Thunderstorm` to CSS gradients. `style.css` supplies the centered layout, search controls, weather card, icon sizing, typography, hover effects, and the `.hidden` utility class used to switch result and error states.

## Key files and safe change points

| File | Change it when you need to | Important contract |
| --- | --- | --- |
| `storm.html` | Add or rearrange visible controls and content | Preserve IDs used by `script.js`, or update both files together |
| `script.js` | Change API requests, validation, rendering, or weather-state behavior | Keep API credentials out of committed client code; handle failed requests clearly |
| `style.css` | Change layout, responsive behavior, colors, or visual states | Preserve `.hidden` unless the JavaScript visibility logic also changes |
| `CONTRIBUTING.md` | Update setup instructions or record a material workflow change | Keep commands accurate for a fresh clone |

The current HTML also contains a machine-specific local file path as the initial image source. The JavaScript replaces that source after a successful API response, but contributors should replace the local path with a repository-relative fallback or remove it when improving the initial state. Do not add personal computer paths to the repository.

## A practical contribution workflow

Create a focused branch before making a change:

```bash
git switch -c describe-your-change
```

Make the smallest coherent edit. For a UI change, update the markup and stylesheet together. For a behavior change, check the element IDs in `storm.html` and the corresponding selectors and event handlers in `script.js`.

Run the local server and manually test both the success and failure paths:

1. Load the page and confirm that the initial layout renders without console errors.
2. Search for a valid city and confirm that the city, temperature, description, icon, and background update.
3. Search for an invalid city and confirm that the error message appears while stale weather details are hidden.
4. Submit a city with the **Enter** key and confirm that it behaves like clicking **Search**.
5. Resize the browser window and check that the layout remains usable.
6. Inspect the browser console and Network panel for failed requests, exposed credentials, or broken asset paths.

Review the diff before committing:

```bash
git diff --check
git diff
```

Commit with a short, specific message and push the branch:

```bash
git add CONTRIBUTING.md storm.html script.js style.css
git commit -m "Improve weather search feedback"
git push -u origin describe-your-change
```

Open a pull request on GitHub with a summary of the user-visible change, the manual checks you performed, and any remaining limitations. Avoid committing API keys, personal file paths, screenshots containing secrets, or unrelated formatting changes.

## Current limitations to know about

The public weather service is intentionally keyless for this static project. If the app later adds a provider that requires credentials, do not place those credentials in browser JavaScript. Use a server-side endpoint and document the configuration path separately.

The app has no automated tests, loading state, request cancellation, rate-limit handling, or detailed error categorization. These are reasonable areas for future contributions. If you add any build tooling or runtime dependency, update this guide and add the relevant manifest and lockfile so a new contributor can reproduce the setup.

## References

[1]: https://open-meteo.com/en/docs/geocoding-api "Open-Meteo Geocoding API documentation"
[2]: https://open-meteo.com/en/docs "Open-Meteo Weather Forecast API documentation"
[3]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API "MDN Fetch API documentation"
[4]: https://docs.python.org/3/library/http.server.html "Python http.server documentation"

The location and forecast behavior described above follows the [Open-Meteo Geocoding API][1] and [Forecast API][2]. Browser requests use the standard [`fetch` API][3], and the local setup example uses Python's built-in [`http.server` module][4].
