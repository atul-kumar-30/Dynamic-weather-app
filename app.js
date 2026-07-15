
//making object of weatherapi
const weatherApi = {
    key: '4eb3703790b356562054106543b748b2',
    baseUrl: 'https://api.openweathermap.org/data/2.5/weather'
}

let isCelsius = true;
let currentWeatherData = null;
let forecastData = null;
let recentSearches = JSON.parse(localStorage.getItem('weatherRecentSearches')) || [];

let unitToggle = document.getElementById('unit-toggle');
let celsiusLabel = document.getElementById('celsius-label');
let fahrenheitLabel = document.getElementById('fahrenheit-label');

unitToggle.addEventListener('click', () => {
    isCelsius = !isCelsius;
    if (isCelsius) {
        celsiusLabel.classList.add('active');
        fahrenheitLabel.classList.remove('active');
    } else {
        fahrenheitLabel.classList.add('active');
        celsiusLabel.classList.remove('active');
    }
    
    if (currentWeatherData && currentWeatherData.cod === 200) {
        showWeaterReport(currentWeatherData);
        showForecast();
    }
});

window.onload = () => {
    updateRecentSearches();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            getWeatherByLocation(position.coords.latitude, position.coords.longitude);
        });
    }
};

function saveRecentSearch(city) {
    if(!recentSearches.includes(city)) {
        recentSearches.unshift(city);
        if(recentSearches.length > 5) recentSearches.pop(); 
        localStorage.setItem('weatherRecentSearches', JSON.stringify(recentSearches));
        updateRecentSearches();
    }
}

function updateRecentSearches() {
    let container = document.getElementById('recent-searches');
    if(!container) return;
    container.innerHTML = '';
    recentSearches.forEach(city => {
        let tag = document.createElement('div');
        tag.className = 'search-tag';
        tag.innerText = city;
        tag.addEventListener('click', () => {
            document.getElementById('input-box').value = city;
            getWeatherReport(city);
        });
        container.appendChild(tag);
    });
}

//anonymous function
//adding event listener key press of enter
let searchInputBox = document.getElementById('input-box');
let searchBtn = document.getElementById('search-btn');

searchInputBox.addEventListener('keypress', (event) => {
    if (event.keyCode == 13 && searchInputBox.value) {
        getWeatherReport(searchInputBox.value);
    }
});

searchBtn.addEventListener('click', () => {
    if (searchInputBox.value) {
        getWeatherReport(searchInputBox.value);
    }
});


//get waether report

function getWeatherReport(city) {
    let loader = document.getElementById('loader');
    let weatherBody = document.getElementById('weather-body');
    let forecastBody = document.getElementById('forecast-body');
    
    weatherBody.style.display = 'none';
    if(forecastBody) forecastBody.style.display = 'none';
    loader.style.display = 'flex';

    fetch(`${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`)
        .then(weather => weather.json())
        .then(weather => {
            if(weather.cod === '404' || weather.cod === '400') {
                loader.style.display = 'none';
                swal("Bad Input", "City not found", "warning");
                reset();
                return;
            }
            saveRecentSearch(weather.name);
            showWeaterReport(weather);
            getForecast(weather.coord.lat, weather.coord.lon);
        })
        .catch(err => {
            loader.style.display = 'none';
            swal("Error", "Failed to fetch data", "error");
        });
}

function getWeatherByLocation(lat, lon) {
    let loader = document.getElementById('loader');
    let weatherBody = document.getElementById('weather-body');
    let forecastBody = document.getElementById('forecast-body');
    
    weatherBody.style.display = 'none';
    if(forecastBody) forecastBody.style.display = 'none';
    loader.style.display = 'flex';

    fetch(`${weatherApi.baseUrl}?lat=${lat}&lon=${lon}&appid=${weatherApi.key}&units=metric`)
        .then(weather => weather.json())
        .then(weather => {
            if(weather.cod === 200) {
                saveRecentSearch(weather.name);
                showWeaterReport(weather);
                getForecast(lat, lon);
            }
        })
        .catch(err => {
            loader.style.display = 'none';
        });
}

//show weather report

function showWeaterReport(weather) {
    let loader = document.getElementById('loader');
    loader.style.display = 'none';

    currentWeatherData = weather;
    
    let op = document.getElementById('weather-body');
    op.style.display = 'block';
    
    let todayDate = new Date();
    
    let temp = weather.main.temp;
    let minTemp = weather.main.temp_min;
    let maxTemp = weather.main.temp_max;
    let feelsLike = weather.main.feels_like;
    let unitSymbol = "&deg;C";

    if (!isCelsius) {
        temp = (temp * 9/5) + 32;
        minTemp = (minTemp * 9/5) + 32;
        maxTemp = (maxTemp * 9/5) + 32;
        feelsLike = (feelsLike * 9/5) + 32;
        unitSymbol = "&deg;F";
    }

    let sunriseTime = formatTimeFromUnix(weather.sys.sunrise);
    let sunsetTime = formatTimeFromUnix(weather.sys.sunset);

    let parent=document.getElementById('parent');
    let weather_body = document.getElementById('weather-body');
    weather_body.innerHTML =
        `
    <div class="location-deatils">
        <div class="city" id="city">${weather.name}, ${weather.sys.country}</div>
        <div class="date" id="date">${dateManage(todayDate)} &bull; ${getTime(todayDate)}</div>
    </div>
    
    <div class="hero-weather">
        <i class="${getIconClass(weather.weather[0].main)} icon-large"></i>
        <div class="temp" id="temp">${Math.round(temp)}&deg;</div>
    </div>
    
    <div class="weather-desc" id="weather">${weather.weather[0].main}</div>
    <div class="min-max" id="min-max">${Math.floor(minTemp)}${unitSymbol} (min) / ${Math.ceil(maxTemp)}${unitSymbol} (max)</div>
    
    <div class="details-grid">
        <div class="detail-card">
            <i class="fas fa-temperature-high"></i>
            <div class="detail-info">
                <span class="label">Feels Like</span>
                <span class="value">${Math.round(feelsLike)}${unitSymbol}</span>
            </div>
        </div>
        <div class="detail-card">
            <i class="fas fa-tint"></i>
            <div class="detail-info">
                <span class="label">Humidity</span>
                <span class="value">${weather.main.humidity}%</span>
            </div>
        </div>
        <div class="detail-card">
            <i class="fas fa-wind"></i>
            <div class="detail-info">
                <span class="label">Wind</span>
                <span class="value">${weather.wind.speed} km/h</span>
            </div>
        </div>
        <div class="detail-card">
            <i class="fas fa-tachometer-alt"></i>
            <div class="detail-info">
                <span class="label">Pressure</span>
                <span class="value">${weather.main.pressure} mb</span>
            </div>
        </div>
    </div>
    
    <div class="sun-times">
        <div class="sun-item"><i class="fas fa-sunrise"></i><span class="time">${sunriseTime}</span></div>
        <div class="sun-item"><i class="fas fa-sunset"></i><span class="time">${sunsetTime}</span></div>
    </div>
    `;
    
    changeBg(weather.weather[0].main);
    reset();
}

function getForecast(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherApi.key}&units=metric`)
    .then(res => res.json())
    .then(data => {
        forecastData = data;
        showForecast();
    });
}

function showForecast() {
    if(!forecastData) return;
    let forecastBody = document.getElementById('forecast-body');
    if(!forecastBody) return;
    forecastBody.style.display = 'block';
    
    let html = `<div class="forecast-title">5-Day Forecast</div><div class="forecast-scroll">`;
    
    let dailyData = [];
    let seenDays = new Set();
    forecastData.list.forEach(item => {
        let dayStr = new Date(item.dt * 1000).toDateString();
        if(!seenDays.has(dayStr) && dailyData.length < 5) {
            seenDays.add(dayStr);
            dailyData.push(item);
        }
    });

    dailyData.forEach(item => {
        let date = new Date(item.dt * 1000);
        let dayName = date.toLocaleDateString('en-US', {weekday: 'short'});
        let fTemp = item.main.temp;
        let unitSymbol = "&deg;C";
        if (!isCelsius) {
            fTemp = (fTemp * 9/5) + 32;
            unitSymbol = "&deg;F";
        }
        
        html += `
        <div class="forecast-card">
            <div class="day">${dayName}</div>
            <i class="${getIconClass(item.weather[0].main)}"></i>
            <div class="f-temp">${Math.round(fTemp)}${unitSymbol}</div>
        </div>
        `;
    });
    html += `</div>`;
    forecastBody.innerHTML = html;
}

function changeBg(status) {
    document.body.className = '';
    if (status === 'Clouds') {
        document.body.classList.add('bg-clouds');
    } else if (status === 'Rain' || status === 'Drizzle') {
        document.body.classList.add('bg-rain');
    } else if (status === 'Clear') {
        document.body.classList.add('bg-clear');
    } else if (status === 'Snow') {
        document.body.classList.add('bg-snow');
    } else if (status === 'Thunderstorm') {
        document.body.classList.add('bg-thunderstorm');
    } else {
        document.body.classList.add('bg-clouds');
    }
}

function formatTimeFromUnix(unixTime) {
    let date = new Date(unixTime * 1000);
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return hours + ':' + minutes.substr(-2) + ' ' + ampm;
}



//making a function for the  last update current time 

function getTime(todayDate) {
    let hour =addZero(todayDate.getHours());
    let minute =addZero(todayDate.getMinutes());
    return `${hour}:${minute}`;
}

//date manage for return  current date
function dateManage(dateArg) {
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    let year = dateArg.getFullYear();
    let month = months[dateArg.getMonth()];
    let date = dateArg.getDate();
    let day = days[dateArg.getDay()];
    // console.log(year+" "+date+" "+day+" "+month);
    return `${date} ${month} (${day}) , ${year}`
}

// function for the dynamic background change  according to weather status
function changeBg(status) {
    if (status === 'Clouds') {
        document.body.style.backgroundImage = 'url(img/clouds.jpg)';
    } else if (status === 'Rain') {
        document.body.style.backgroundImage = 'url(img/rainy.jpg)';
    } else if (status === 'Clear') {
        document.body.style.backgroundImage = 'url(img/clear.jpg)';
    }
    else if (status === 'Snow') {
        document.body.style.backgroundImage = 'url(img/snow.jpg)';
    }
    else if (status === 'Sunny') {
        document.body.style.backgroundImage = 'url(img/sunny.jpg)';
    } else if (status === 'Thunderstorm') {
        document.body.style.backgroundImage = 'url(img/thunderstrom.jpg)';
    } else if (status === 'Drizzle') {
        document.body.style.backgroundImage = 'url(img/drizzle.jpg)';
    } else if (status === 'Mist' || status === 'Haze' || status === 'Fog') {
        document.body.style.backgroundImage = 'url(img/mist.jpg)';
    }

    else {
        document.body.style.backgroundImage = 'url(img/bg.jpg)';
    }
}

//making a function for the classname of icon
function getIconClass(classarg) {
    if (classarg === 'Rain') {
        return 'fas fa-cloud-showers-heavy';
    } else if (classarg === 'Clouds') {
        return 'fas fa-cloud';
    } else if (classarg === 'Clear') {
        return 'fas fa-cloud-sun';
    } else if (classarg === 'Snow') {
        return 'fas fa-snowman';
    } else if (classarg === 'Sunny') {
        return 'fas fa-sun';
    } else if (classarg === 'Mist') {
        return 'fas fa-smog';
    } else if (classarg === 'Thunderstorm' || classarg === 'Drizzle') {
        return 'fas fa-thunderstorm';
    } else {
        return 'fas fa-cloud-sun';
    }
}

function reset() {
    let input = document.getElementById('input-box');
    input.value = "";
}

// funtion to add zero if hour and minute less than 10
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}