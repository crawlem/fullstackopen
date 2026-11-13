const ResultList = ({ countries }) => {
    if (!countries || countries === null || countries.length <= 1) {
        return null
    }

    if (countries.length > 10) {
        return (
            <section>
                <p>Too many matches, specify another filter</p>
            </section>
        )
    }

    return (
        <section>
            <ul>
                {countries.map(country => (
                    <li key={country.cca2}>{country.name.common}</li>
                ))}
            </ul>
        </section>
    )
}

export default ResultList