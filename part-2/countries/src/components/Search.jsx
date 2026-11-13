const Search = ({ search, setSearch }) => {
    return (
        <section>
            <form>
                <label htmlFor="search">find countries</label> <input name="search" id="search" value={search} onChange={(e) => setSearch(e.target.value)} />
            </form>
        </section>
    )
}

export default Search