import WeatherIcon from './WeatherIcon'

const Weather = ({ weather, country, weatherDescription }) => {
    if (!country || country === null || country === undefined || weather === null || weather === undefined) {
        return null
    }

    return (
        <section>
            <h3>Weather in {country.capital[0]}</h3>
            <p>Temperature {weather.current.temperature_2m} {weather.current_units.temperature_2m}</p>
            <p><WeatherIcon iconCode={weather.current.weather_code} isDay={weather.current.is_day} description={weatherDescription} /></p>
            <p>Wind {weather.current.wind_speed_10m} {weather.current_units.wind_speed_10m}</p>
        </section>
    )
}

export default Weather