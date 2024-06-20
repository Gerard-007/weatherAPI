const mongoose = require('mongoose');

const WeatherSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    temperature: { type: Number, required: true },
    location: { type: String, required: true }
});

const Weather = mongoose.model('Weather', WeatherSchema);

module.exports = Weather;