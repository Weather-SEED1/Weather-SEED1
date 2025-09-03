const apiKey = "ea0bfb722996db6da6f27d827b132410";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) { // Accept the `city` as a parameter
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    var data = await response.json();

    console.log(data);

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + "km/h";

    if (data.weather[0].main == "Clouds") {
    weatherIcon.src = "assets/cloudy2.png";
} else if (data.weather[0].main == "Clear") {
    weatherIcon.src = "assets/sun.png";
} else if (data.weather[0].main == "Rain") {
    // If your image file is actually named 'cloudy-1.png'
    weatherIcon.src = "assets/cloudy1.png"; 
}  else if (data.weather[0].main == "Drizzle") {
    weatherIcon.src = "assets/cloudy3.png";
} else if (data.weather[0].main == "Mist") {
    weatherIcon.src = "assets/mist.png";
}

}

searchBtn.addEventListener("click", () => {
    // Pass the correct value property of the input to the function
    checkWeather(searchBox.value);
});
