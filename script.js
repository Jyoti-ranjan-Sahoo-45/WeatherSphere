const apiKey = "2bdb104e7bbc464297f82257251002";
let isCelsius = true;

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.querySelector('.content h1').classList.add('reveal');
    }, 500);
});

function fetchWeather() {
    const city = document.getElementById("cityInput").value;
    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    document.getElementById("loading").classList.remove("hidden");
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5&aqi=yes`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            updateWeatherUI(data);
            updateMap(data.location.lat, data.location.lon);
            updateForecast(data.forecast.forecastday);

            // Reveal elements
            document.querySelector('.content h1').classList.add('reveal');
            document.getElementById("weatherInfo").classList.remove("hidden");
            document.getElementById("forecast").classList.remove("hidden");
            document.getElementById("map").classList.remove("hidden");
        })
        .catch(error => console.error("Error fetching data:", error))
        .finally(() => document.getElementById("loading").classList.add("hidden"));
}

function updateWeatherUI(data) {
    const temp = isCelsius ? `${data.current.temp_c}°C` : `${data.current.temp_f}°F`;
    document.getElementById("location").innerText = `${data.location.name}, ${data.location.country}`;
    document.getElementById("temperature").innerText = `Temperature: ${temp}`;
    document.getElementById("humidity").innerText = `Humidity: ${data.current.humidity}%`;
    document.getElementById("wind").innerText = `Wind Speed: ${data.current.wind_kph} kph`;
    document.getElementById("weatherIcon").src = data.current.condition.icon;
}

function updateForecast(forecastDays) {
    const forecastElement = document.getElementById("forecast");
    
    if (!forecastDays || forecastDays.length <= 4) {
        forecastElement.innerHTML = "<p>Insufficient forecast data available.</p>";
        return;
    }

    forecastElement.innerHTML = forecastDays.slice(0, 4).map(day => `
        <div class="forecast-day">
            <h3>${new Date(day.date).toLocaleDateString()}</h3>
            <img src="${day.day.condition.icon}" alt="${day.day.condition.text}">
            <p>Condition: ${day.day.condition.text}</p>
            <p>Max: ${isCelsius ? `${day.day.maxtemp_c}°C` : `${day.day.maxtemp_f}°F`}</p>
            <p>Min: ${isCelsius ? `${day.day.mintemp_c}°C` : `${day.day.mintemp_f}°F`}</p>
        </div>
    `).join('');
}

function toggleUnit() {
    isCelsius = !isCelsius;
    fetchWeather();
    document.querySelector("button[onclick='toggleUnit()']").innerText = `Switch to ${isCelsius ? '°F' : '°C'}`;
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

function updateMap(lat, lon) {
    document.getElementById("map").innerHTML = "";

    const map = tt.map({
        key: "5dAQvsH82ekuVgANiMt3ksq378MbqSsO",
        container: "map",
        center: [lon, lat],
        zoom: 10
    });

    new tt.Marker().setLngLat([lon, lat]).addTo(map);
}
