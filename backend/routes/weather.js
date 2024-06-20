const express = require('express');
const router = express.Router()
const {getWeather, getWeatherPlot} = require("../controllers/weather")

router.route("/").get(getWeather)
router.route('/plot').get(getWeatherPlot)

module.exports = router;
