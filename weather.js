const apiKey = "ea0bfb722996db6da6f27d827b132410";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) { // Accept the `city` as a parameter
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    // Handle 404 error
    if (response.status == 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    } else {
        document.querySelector(".error").style.display = "none";
        document.querySelector(".weather").style.display = "block";
    }
    // Parse the JSON response
    var data = await response.json();

    // console.log(data);
    
    // Update the DOM elements with the fetched data
    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + "km/h";


    // Set the weather icon based on the weather condition

    if (data.weather[0].main == "Clouds") {
    weatherIcon.src = "assets/cloudy2.png";
} else if (data.weather[0].main == "Clear") {
    weatherIcon.src = "assets/sun.png";
} else if (data.weather[0].main == "Rain") {
    weatherIcon.src = "assets/cloudy1.png"; 
}  else if (data.weather[0].main == "Drizzle") {
    weatherIcon.src = "assets/cloudy3.png";
} else if (data.weather[0].main == "Mist") {
    weatherIcon.src = "assets/mist.png";
}

}



// Add an event listener to the search button
searchBtn.addEventListener("click", () => {
    // Pass the correct value property of the input to the function
    checkWeather(searchBox.value);
});
