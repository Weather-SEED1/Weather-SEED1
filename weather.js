const apiKey = "ea0bfb722996db6da6f27d827b132410";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.getElementById("cityInput");
const searchBtn = document.querySelector(".searchBtn");
const errorMsg = document.querySelector(".error");
const mainWeatherCard = document.querySelector(".weather-card.active-card");
const weatherGrid = document.querySelector(".weather-grid");
const showMoreInfoBtn = document.getElementById("showMoreInfoBtn");
const detailsCard = document.querySelector(".details-card");
const addCardBtn = document.getElementById("addCardBtn");

let lastSearchedCity = "";

// A helper function to set the weather icon based on condition
function setWeatherIcon(iconElement, weatherCondition) {
    if (weatherCondition === "Clouds") {
        iconElement.src = "./assets/cloudy2.png";
    } else if (weatherCondition === "Clear") {
        iconElement.src = "./assets/sun.png";
    } else if (weatherCondition === "Rain") {
        iconElement.src = "./assets/cloudy1.png";
    } else if (weatherCondition === "Drizzle") {
        iconElement.src = "./assets/cloudy3.png";
    } else if (weatherCondition === "Mist") {
        iconElement.src = "./assets/mist.png";
    } else {
        iconElement.src = "./assets/cloudy1.png"; // Default icon
    }
}

// Function to update the DOM with weather data
async function updateWeatherCard(city, cardElement) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    if (response.status === 404) {
        if (cardElement === mainWeatherCard) {
            errorMsg.style.display = "block";
            cardElement.querySelector(".weather").style.display = "none";
        }
        return false; // Indicates an error
    } else {
        if (cardElement === mainWeatherCard) {
            errorMsg.style.display = "none";
            cardElement.querySelector(".weather").style.display = "block";
        }
    }

    const data = await response.json();

    // Update main weather details
    cardElement.querySelector(".city").innerHTML = data.name;
    cardElement.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
    cardElement.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    cardElement.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
    setWeatherIcon(cardElement.querySelector(".weather-icon"), data.weather[0].main);

    // If it's the main card, store the city and update the details card
    if (cardElement === mainWeatherCard) {
        lastSearchedCity = city;
        // Also update the additional info card if it's visible
        if (detailsCard.style.display !== "none") {
            updateAdditionalDetails(data);
        }
    }
    
    return true; // Indicates success
}

// Function to update the additional details card
function updateAdditionalDetails(data) {
    if (data) {
        detailsCard.querySelector(".feels-like").innerHTML = Math.round(data.main.feels_like) + "°C";
        detailsCard.querySelector(".pressure").innerHTML = data.main.pressure + " hPa";
        
        // Convert Unix timestamps to local time
        const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
        const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();
        
        detailsCard.querySelector(".sunrise").innerHTML = sunriseTime;
        detailsCard.querySelector(".sunset").innerHTML = sunsetTime;
    }
}

// Event listener for the main search button
searchBtn.addEventListener("click", () => {
    updateWeatherCard(searchBox.value, mainWeatherCard);
});

// Event listener for the 'More Details' button in the sidebar
showMoreInfoBtn.addEventListener("click", () => {
    if (lastSearchedCity) {
        detailsCard.style.display = "block";
        // Re-fetch data to be safe and update details
        updateWeatherCard(lastSearchedCity, mainWeatherCard);
    } else {
        alert("Please search for a city first.");
    }
});

// Event listener for the 'Add New City' button
addCardBtn.addEventListener("click", async () => {
    const newCity = prompt("Enter the name of the city to add:");
    if (newCity && newCity.trim() !== "") {
        // Create a new card element dynamically
        const newCard = document.createElement('div');
        newCard.className = "card weather-card dynamic-card";
        newCard.innerHTML = `
            <div class="weather">
                <img src="./assets/cloudy1.png" alt="weather icon" class="weather-icon">
                <h1 class="temp">Loading...</h1>
                <h2 class="city">${newCity}</h2>
                <div class="details">
                    <div class="col col-1">
                        <img src="./assets/humidity.png" alt="humidity" width="10%">
                        <div>
                            <p class="humidity">--%</p>
                            <p>Humidity</p>
                        </div>
                    </div>
                    <div class="col col-2">
                        <img src="./assets/weather.png" alt="wind" width="10%">
                        <div>
                            <p class="wind">-- km/h</p>
                            <p>Wind Speed</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Insert the new card into the grid
        weatherGrid.insertBefore(newCard, addCardBtn.parentElement);
        
        // Update the content of the new card with weather data
        const success = await updateWeatherCard(newCity, newCard);
        
        // If the API call fails, remove the card
        if (!success) {
            newCard.remove();
            alert(`Could not find weather information for "${newCity}".`);
        }
    }
});