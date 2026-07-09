const apiKey = "8a6e4a1ca74624f18f83d849da35d848";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const errorMessage = document.getElementById("errorMessage");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const weatherDescription = document.getElementById("weatherDescription");
const weatherIcon = document.getElementById("weatherIcon");

const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");

async function getWeather(city) {

    const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {

        const response = await fetch(url);

        const data = await response.json();

        console.log(data);

        if (data.cod != 200) {

    errorMessage.classList.remove("hidden");

    return;
}
        errorMessage.classList.add("hidden");

        cityName.textContent = data.name;

        temperature.textContent =
            Math.round(data.main.temp) + "°C";

        weatherDescription.textContent =
            data.weather[0].description;
            const iconCode = data.weather[0].icon;

        weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;                
        humidity.textContent = data.main.humidity + "%";

       wind.textContent =
    (data.wind.speed * 3.6).toFixed(1) + " km/h";
        pressure.textContent = data.main.pressure + " hPa";

        visibility.textContent = data.visibility / 1000 + " km";
        getFiveDayForecast(city);
        getHourlyForecast(city);

    }

    catch (error) {
 console.log(error);

    }

}

searchBtn.addEventListener("click", function () {

    const city = cityInput.value.trim();

    if (city === "") {
        alert("Please enter a city name");
        return;
    }

    getWeather(city);

});

getWeather("Bengaluru");
async function getFiveDayForecast(city) {

    const forecastUrl =
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(forecastUrl);

    const data = await response.json();

    const forecastContainer =
        document.getElementById("fiveDayForecast");

    forecastContainer.innerHTML = "";

    const dailyForecast = data.list.filter(function (item) {

        return item.dt_txt.includes("12:00:00");

    });

    dailyForecast.forEach(function (day) {

        const date = new Date(day.dt_txt);

        const dayName = date.toLocaleDateString("en-US", {
            weekday: "long"
        });

        const iconCode = day.weather[0].icon;

        forecastContainer.innerHTML += `

            <div class="bg-slate-800 p-7 rounded-xl text-center">

                <h3 class="font-bold">
                    ${dayName}
                </h3>

                <img
                    src="https://openweathermap.org/img/wn/${iconCode}@2x.png"
                    class="w-20 mx-auto">

                <p class="text-xl font-bold">

                    ${Math.round(day.main.temp)}°C

                </p>

                <p class="text-gray-400 capitalize mt-2">

                    ${day.weather[0].description}

                </p>

            </div>

        `;

    });

}
async function getHourlyForecast(city) {

    const hourlyUrl =
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(hourlyUrl);

    const data = await response.json();

    const hourlyContainer =
        document.getElementById("hourlyForecast");

    hourlyContainer.innerHTML = "";

    const nextSixForecasts = data.list.slice(0, 6);

    nextSixForecasts.forEach(function (hour) {

        const time = new Date(hour.dt_txt);

        const formattedTime = time.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit"
        });

        const iconCode = hour.weather[0].icon;

        hourlyContainer.innerHTML += `

            <div class="bg-slate-800 p-6 rounded-xl text-center">

                <p class="font-semibold">
                    ${formattedTime}
                </p>

                <img
                    src="https://openweathermap.org/img/wn/${iconCode}@2x.png"
                    class="w-20 mx-auto"
                    alt="Weather icon">

                <p class="text-xl font-bold">
                    ${Math.round(hour.main.temp)}°C
                </p>

                <p class="text-gray-400 capitalize mt-2">
                    ${hour.weather[0].description}
                </p>

            </div>

        `;

    });

}
cityInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        const city = cityInput.value.trim();

        if (city === "") {
            alert("Please enter a city name");
            return;
        }

        getWeather(city);

    }

});
locationBtn.addEventListener("click", function () {

    navigator.geolocation.getCurrentPosition(function (position) {

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        getWeatherByLocation(latitude, longitude);

    });

});
async function getWeatherByLocation(latitude, longitude) {

    const url =
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);

    const data = await response.json();

    getWeather(data.name);

}