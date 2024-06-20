// frontend/src/App.jsx
import { useState } from 'react';
import axios from 'axios';

function App() {
    const [date, setDate] = useState('');
    const [weather, setWeather] = useState(null);

    const fetchWeather = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/v1/weather?date=${date}`);
            setWeather(response.data);
        } catch (error) {
            console.error('Error fetching weather data', error);
        }
    };

    return (

        <div className="justify-content-center">
            <h1>Weather API</h1>
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Enter date"
            />
            <button onClick={fetchWeather}>Get Weather</button>
            {weather && (
              <div>
                  <h2>{weather.location.name}</h2>
                  <p>Temperature: {weather.current.temp_c}°C</p>
                  <p>Weather: {weather.current.condition.text}</p>
              </div>
            )}
        </div>
    );
}

export default App;
