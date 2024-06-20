const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
const Weather = require('../models/weather');

const getWeather = async (req, res) => {
    try {
        const { date } = req.query;
        const apiKey = process.env.WEATHER_API_KEY;
        const location = 'Lagos';

        // API request
        const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&dt=${date}`);

        const weatherData = response.data;

        // Save to DB
        const weatherEntry = new Weather({
            date: new Date(date),
            temperature: weatherData.current.temp_c,
            location: weatherData.location.name
        });

        await weatherEntry.save();

        res.status(StatusCodes.OK).json(response.data);
    } catch (error) {
        console.error('Error fetching weather data:', error);

        const statusCode = error.response ? error.response.status : StatusCodes.REQUEST_TIMEOUT;
        res.status(statusCode).json({ message: 'Error fetching weather data' });
    }
};


const getWeatherPlot = async (req, res) => {
    try {
        const { date } = req.query;
        const apiKey = process.env.WEATHER_API_KEY;
        const location = 'Lagos';
        const startDate = new Date(date);
        const weatherDataArray = [];

        for (let i = 0; i < 14; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() - i);
            const formattedDate = currentDate.toISOString().split('T')[0];

            const response = await axios.get(`http://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${location}&dt=${formattedDate}`);
            const weatherData = response.data;
            weatherDataArray.push({
                date: formattedDate,
                temperature: weatherData.forecast.forecastday[0].day.avgtemp_c
            });
        }

        res.status(StatusCodes.OK).json(weatherDataArray);
    } catch (error) {
        console.error('Error fetching weather data:', error);

        const statusCode = error.response ? error.response.status : StatusCodes.REQUEST_TIMEOUT;
        res.status(statusCode).json({ message: 'Error fetching weather data' });
    }
};


module.exports = { getWeather, getWeatherPlot };

