import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Weather() {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const cityName = 'Seoul';
    const apiKey = process.env.REACT_APP_WEATHER_KEY;

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`);
                setWeatherData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching weather data:', error);
                setLoading(false);
            }
        };

        fetchWeatherData();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!weatherData) {
        return <p>Failed to fetch weather data</p>;
    }

    return (
        <div>
            <p>
                <strong>{weatherData.name}</strong> {(weatherData.main.temp - 273.15).toFixed(1)}℃ {weatherData.weather[0].description}
            </p>
        </div>
    );
}

export default Weather;
