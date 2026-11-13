import { useState, useEffect } from 'react'
import countryService from './services/countryService'
import Search from './components/Search'
import ResultList from './components/ResultList'
import Country from './components/Country'

function App() {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    countryService.getAll()
      .then(data => {
        setCountries(data)
      })
  }, [])

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
      <ResultList countries={filteredCountries} />
      <Country country={selectedCountry} />
    </>
  )
}

export default App