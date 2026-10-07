const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityElement = document.getElementById("city");
const temperatureElement = document.getElementById("temperature");
const conditionElement = document.getElementById("condition");
const windElement = document.getElementById("wind");

searchBtn.addEventListener("click", getWeather);

async function getWeather() {
    const city = cityInput.value.trim();

    if (!city) {
        return;
    }

    // 1. Get coordinates from city name
    const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
    );

    const geoData = await geoResponse.json();

    if (!geoData.results) {
        cityElement.textContent = "City not found";
        return;
    }

    const location = geoData.results[0];

    const latitude = location.latitude;
    const longitude = location.longitude;

    // 2. Get weather using coordinates
    const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m`
    );

    const weatherData = await weatherResponse.json();

    const current = weatherData.current;

    // 3. Display result
    cityElement.textContent = location.name;

    temperatureElement.textContent =
        `${current.temperature_2m}°C`;

    windElement.textContent =
        `Wind: ${current.wind_speed_10m} km/h`;

    conditionElement.textContent =
        getWeatherCondition(current.weather_code);
}


function getWeatherCondition(code) {
    if (code === 0) return "Clear sky";

    if ([1, 2, 3].includes(code))
        return "Cloudy";

    if ([45, 48].includes(code))
        return "Fog";

    if ([51, 53, 55, 56, 57].includes(code))
        return "Drizzle";

    if ([61, 63, 65, 66, 67].includes(code))
        return "Rain";

    if ([71, 73, 75, 77].includes(code))
        return "Snow";

    if ([80, 81, 82].includes(code))
        return "Rain showers";

    if ([95, 96, 99].includes(code))
        return "Thunderstorm";

    return "Unknown";
}
