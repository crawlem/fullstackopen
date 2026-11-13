import { useState, useEffect } from 'react'
import countryService from './services/countryService'
import weatherService from './services/weatherService'
import Search from './components/Search'
import ResultList from './components/ResultList'
import Country from './components/Country'
import Weather from './components/Weather'

function App() {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)
  const [weatherDescription, setWeatherDescription] = useState('')

  useEffect(() => {
    countryService.getAll()
      .then(data => {
        setCountries(data)
      })
  }, [])

  useEffect(() => {
    if (selectedCountry) {
      const lat = selectedCountry.latlng[0]
      const lon = selectedCountry.latlng[1]

      weatherService.getWeather(lat, lon)
        .then(response => {
          setWeather(response.data)
          setWeatherDescription(weatherService.weatherCodeMapping[response.data.current.weather_code])
        })
    }
  }, [selectedCountry])

  useEffect(() => {
    const filtered = countries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase()))
    if (filtered.length === 1) {
      setSelectedCountry(filtered[0])
      setFilteredCountries([])
    } else {
      setSelectedCountry(null)
      setFilteredCountries(filtered)
    }
  }, [search, countries])

  return (
    <>
      <Search search={search} setSearch={setSearch} />
      <ResultList countries={filteredCountries} setSelectedCountry={setSelectedCountry} />
      <Country country={selectedCountry} />
      <Weather weather={weather} weatherDescription={weatherDescription} country={selectedCountry} />
    </>
  )
}

export default App