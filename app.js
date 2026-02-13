// API URLs
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

// DOM-element
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherInfo = document.getElementById('weather-info');
const errorMsg = document.getElementById('error-msg');
 
// Väderdata-element
const cityName = document.getElementById('city-name');
const date = document.getElementById('date');
const temp = document.getElementById('temp');
const weatherIcon = document.getElementById('weather-icon');
const weatherDesc = document.getElementById('weather-desc');
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const pressure = document.getElementById('pressure');
const mapContainer = document.getElementById('map-container');
const forecastContainer = document.getElementById('forecast-container');
const forecastDays = document.getElementById('forecast-days');

// Karta
let map = null;
let marker = null;

// Event listeners
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeatherData(city);
        }
    }
});

// Hämta väderdata från API
async function getWeatherData(city) {
    try {
        hideError();
        weatherInfo.classList.add('hidden');
        forecastContainer.classList.add('hidden');

        const response = await fetch(
            `${API_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=sv`
        );

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Staden hittades inte');
            } else if (response.status === 401) {
                throw new Error('Ogiltig API-nyckel. Hämta en gratis nyckel från openweathermap.org');
            } else {
                throw new Error('Kunde inte hämta väderdata');
            }
        }

        const data = await response.json();
        displayWeatherData(data);
        
        // Hämta också prognosdata
        getForecastData(city);
    } catch (error) {
        showError(error.message);
    }
}

// Visa väderdata
function displayWeatherData(data) {
    // Uppdatera plats och datum
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    date.textContent = getCurrentDate();

    // Uppdatera temperatur och väder
    temp.textContent = Math.round(data.main.temp);
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherDesc.textContent = data.weather[0].description;

    // Uppdatera detaljer
    feelsLike.textContent = Math.round(data.main.feels_like);
    humidity.textContent = data.main.humidity;
    wind.textContent = data.wind.speed.toFixed(1);
    pressure.textContent = data.main.pressure;

    // Uppdatera karta
    updateMap(data.coord.lat, data.coord.lon, data.name);

    // Visa väderinformation
    weatherInfo.classList.remove('hidden');
}

// Visa felmeddelande
function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.remove('hidden');
}

// Dölj felmeddelande
function hideError() {
    errorMsg.classList.add('hidden');
}

// Hämta aktuellt datum
function getCurrentDate() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return now.toLocaleDateString('sv-SE', options);
}

// Hämta prognosdata
async function getForecastData(city) {
    try {
        const response = await fetch(
            `${FORECAST_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=sv`
        );

        if (!response.ok) {
            throw new Error('Kunde inte hämta prognosdata');
        }

        const data = await response.json();
        displayForecastData(data);
    } catch (error) {
        console.error('Fel vid hämtning av prognos:', error);
    }
}

// Visa prognosdata
function displayForecastData(data) {
    forecastDays.innerHTML = '';
    
    // Gruppera prognosdata per dag (API ger data var 3:e timme)
    const dailyData = {};
    
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toLocaleDateString('sv-SE', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit' 
        });
        
        if (!dailyData[dateKey]) {
            dailyData[dateKey] = {
                temps: [],
                weather: item.weather[0],
                date: date
            };
        }
        
        dailyData[dateKey].temps.push(item.main.temp);
    });
    
    // Skapa kort för varje dag (max 10 dagar, men API ger endast ~5 dagar)
    const days = Object.values(dailyData).slice(0, 10);
    
    days.forEach(day => {
        const maxTemp = Math.round(Math.max(...day.temps));
        const minTemp = Math.round(Math.min(...day.temps));
        
        const dayCard = document.createElement('div');
        dayCard.className = 'forecast-day';
        
        const dayName = day.date.toLocaleDateString('sv-SE', { weekday: 'short' });
        const dayDate = day.date.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' });
        
        dayCard.innerHTML = `
            <div class="forecast-date">
                <div class="day-name">${dayName}</div>
                <div class="day-date">${dayDate}</div>
            </div>
            <img src="https://openweathermap.org/img/wn/${day.weather.icon}.png" alt="${day.weather.description}" />
            <div class="forecast-temps">
                <span class="temp-max">${maxTemp}°</span>
                <span class="temp-min">${minTemp}°</span>
            </div>
            <div class="forecast-desc">${day.weather.description}</div>
        `;
        
        forecastDays.appendChild(dayCard);
    });
    
    forecastContainer.classList.remove('hidden');
}

// Initialisera och uppdatera kartan
function updateMap(lat, lon, cityName) {
    mapContainer.classList.remove('hidden');
    
    // Initialisera kartan om den inte finns
    if (!map) {
        map = L.map('map').setView([lat, lon], 10);
        
        // Lägg till kartlager från OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);
    } else {
        // Uppdatera vyn om kartan redan finns
        map.setView([lat, lon], 10);
    }
    
    // Ta bort gammal markör om den finns
    if (marker) {
        map.removeLayer(marker);
    }
    
    // Lägg till ny markör
    marker = L.marker([lat, lon]).addTo(map)
        .bindPopup(`<b>${cityName}</b>`)
        .openPopup();
}

// Ladda standardstad vid start (valfritt)
window.addEventListener('load', () => {
    // Du kan automatiskt ladda en stad här, t.ex:
    // getWeatherData('Stockholm');
});
