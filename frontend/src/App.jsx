import { useState } from 'react';
import axios from 'axios';
import { Chart as ChartJS } from 'chart.js/auto';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

function App() {
    const [date, setDate] = useState('');
    const [weather, setWeather] = useState(null);
    const [weatherPlotData, setWeatherPlotData] = useState(null);

    const fetchWeather = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/v1/weather?date=${date}`);
            setWeather(response.data);
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching weather data', error);
        }
    };

    const fetchWeatherPlot = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/v1/weather/plot?date=${date}`);
            setWeatherPlotData(response.data);
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching weather plot data', error);
        }
    };

    return (
        <div>
            <h1>Weather API</h1>
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Enter date"
            />
            <button onClick={fetchWeather}>Get Weather</button>
            <button onClick={fetchWeatherPlot}>Get Weather Plot</button>

            {weather && (
                <div>
                  <h2>Weather Data</h2>
                  <p>Temperature: {weather.temperature}°C</p>
                  <p>Date: {new Date(weather.date).toLocaleDateString()}</p>
                </div>
            )}


            {weatherPlotData && (
                <div>
                    <h2>Weather Plot</h2>
                    <Line
                      data={{
                        labels: weatherPlotData.map(entry => entry.date),
                        datasets: [{
                          label: 'Temperature (°C)',
                          data: weatherPlotData.map(entry => entry.temperature),
                          borderColor: 'rgba(75, 192, 192, 1)',
                          backgroundColor: 'rgba(75, 192, 192, 0.2)',
                          fill: true,
                        }]
                      }}
                    />
                    {/* <Line
                        data={{
                            labels: weatherPlotData.map(entry => entry.date),
                            datasets: [{
                                label: 'Temperature (°C)',
                                data: weatherPlotData.map(entry => entry.temperature),
                                // borderColor: 'rgba(75, 192, 192, 1)',
                                // backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                // fill: true,
                            }],
                        }}
                        options={{
                            scales: {
                                x: {
                                    type: 'time',
                                    time: {
                                        unit: 'day'
                                    }
                                }
                            }
                        }}
                    /> */}
                </div>
            )}
        </div>
    );
}

export default App;
