const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
const Weather = require('../models/weather');

const getWeather = async (req, res) => {
    try {
        const { date } = req.query;
        const apiKey = process.env.WEATHER_API_KEY;
        const location = 'Lagos';

        if (!date || isNaN(Date.parse(date))) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid date format' });
        }

        // Check if the weather data for the given date exists in the database
        let weatherEntry = await Weather.findOne({ date: new Date(date).toISOString().split('T')[0] });

        if (weatherEntry) {
            // Return the existing weather data
            return res.status(StatusCodes.OK).json(weatherEntry);
        }

        // API request
        const response = await axios.get(`http://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${location}&dt=${date}`);

        const weatherData = response.data;

        // Save to DB
        weatherEntry = new Weather({
            date: new Date(date),
            temperature: weatherData.forecast.forecastday[0].day.avgtemp_c,
            condition: weatherData.forecast.forecastday[0].day.condition.text,
            location: weatherData.location.name
        });

        await weatherEntry.save();

        res.status(StatusCodes.OK).json(weatherEntry);
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

            // Check if the data for the current date exists in the database
            let weatherData = await Weather.findOne({ date: formattedDate });
            if (!weatherData) {
                // If not, fetch from the API and save to the database
                const response = await axios.get(`http://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${location}&dt=${formattedDate}`);
                weatherData = response.data;

                const newWeatherEntry = new Weather({
                    date: new Date(formattedDate),
                    temperature: weatherData.forecast.forecastday[0].day.avgtemp_c,
                    condition: weatherData.forecast.forecastday[0].day.condition.text,
                    location: weatherData.location.name
                });

                await newWeatherEntry.save();
                weatherData = newWeatherEntry;
            }

            weatherDataArray.push({
                date: formattedDate,
                temperature: weatherData.temperature,
                condition: weatherData.condition,
                location: weatherData.location,
            });
        }

        console.log(weatherDataArray)

        res.status(StatusCodes.OK).json(weatherDataArray);
    } catch (error) {
        console.error('Error fetching weather data:', error);

        const statusCode = error.response ? error.response.status : StatusCodes.REQUEST_TIMEOUT;
        res.status(statusCode).json({ message: 'Error fetching weather data' });
    }
};


module.exports = { getWeather, getWeatherPlot };

