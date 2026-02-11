// API-konfiguration
// OBS! Du behöver en egen API-nyckel från https://openweathermap.org/api
const API_KEY = 'DIN_API_NYCKEL_HÄR';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

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

// Ladda standardstad vid start (valfritt)
window.addEventListener('load', () => {
    // Du kan automatiskt ladda en stad här, t.ex:
    // getWeatherData('Stockholm');
});
