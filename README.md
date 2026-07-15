# 🌤️ Dynamic Weather App

A beautiful, premium, and fully responsive weather application built with Vanilla HTML, CSS, and JavaScript. It uses the OpenWeatherMap API to deliver real-time weather data and 5-day forecasts.

## ✨ Features

- **📍 Geolocation Auto-Detect**: Instantly fetches the weather for your current location the moment you open the app.
- **🎨 Dynamic Animated Backgrounds**: Features a purely CSS-driven background with floating orbs that intelligently change colors based on the current weather (e.g., deep blues for rain, icy whites for snow, burnt oranges for clear skies).
- **💎 Dark Glassmorphism UI**: A stunning, modern dark-mode frosted glass interface that provides high contrast and a premium feel.
- **📅 5-Day Forecast**: A horizontally scrollable timeline showing weather predictions for the next 5 days.
- **⭐ Recent Searches**: Automatically saves your recently searched cities to your browser's local storage and displays them as quick-access clickable pills.
- **🌡️ Unit Toggle**: Instantly switch between Celsius and Fahrenheit without needing to make another API call.
- **🌅 Sunrise & Sunset**: Displays accurate sunrise and sunset times based on the city's local timezone.

## 🚀 How to Run

Because this project is built with Vanilla web technologies, there are **no dependencies to install**, no `package.json`, and no `requirements.txt`!

1. Clone or download this repository.
2. Open the `index.html` file directly in any modern web browser.
3. *Optional:* If you want to use your own API key, replace the `key` value inside the `weatherApi` object at the top of `app.js` with your OpenWeatherMap API key.

## 🛠️ Technologies Used

- **HTML5**: Semantic structure.
- **CSS3**: Advanced styling, CSS variables, flexbox/grid layouts, `backdrop-filter` for glassmorphism, and keyframe animations.
- **JavaScript (ES6)**: DOM manipulation, `fetch` API for asynchronous network requests, Geolocation API, and `localStorage`.
- **OpenWeatherMap API**: Live weather data and forecasts.
- **FontAwesome**: Icons.
- **Google Fonts**: Uses the 'Outfit' font family.
