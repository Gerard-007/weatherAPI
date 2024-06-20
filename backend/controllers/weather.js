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

        res.status(StatusCodes.OK).json(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error);

        const statusCode = error.response ? error.response.status : StatusCodes.REQUEST_TIMEOUT;
        res.status(statusCode).json({ message: 'Error fetching weather data' });
    }
};

module.exports = { getWeather };

