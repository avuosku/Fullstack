import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);

  const api_key = import.meta.env.VITE_SOME_KEY;

  // 🔹 Haetaan kaikki maat API:sta
  useEffect(() => {
    axios.get("https://studies.cs.helsinki.fi/restcountries/api/all").then((response) => {
      setCountries(response.data);
    });
  }, []);

  // 🔹 Suodatetaan maat hakuehdon perusteella
  const filteredCountries = search
    ? countries.filter((country) =>
        country.name.common.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  // 🔹 Haetaan sää API:sta, jos maa on valittu
  useEffect(() => {
    if (selectedCountry) {
      const capital = selectedCountry.capital?.[0]; // Tarkistetaan, että pääkaupunki on olemassa
      if (capital) {
        axios
          .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${api_key}`)
          .then((response) => {
            setWeather(response.data);
          });
      }
    }
  }, [selectedCountry, api_key]);

  return (
    <div>
      <h1>Country Finder</h1>
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search for a country..." />

      {selectedCountry ? (
        <div>
          <h2>{selectedCountry.name.common}</h2>
          <p>Capital: {selectedCountry.capital?.[0]}</p>
          <p>Population: {selectedCountry.population}</p>
          <p>Area: {selectedCountry.area} km²</p>

          <h3>Languages:</h3>
          <ul>
            {selectedCountry.languages &&
              Object.values(selectedCountry.languages).map((language, index) => (
                <li key={index}>{language}</li>
              ))}
          </ul>

          <img src={selectedCountry.flags?.png} alt="flag" width="150" />

          {weather && (
            <div>
              <h3>Weather in {selectedCountry.capital?.[0]}</h3>
              <p>Temperature: {weather.main.temp} °C</p>
              <p>Wind speed: {weather.wind.speed} m/s</p>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                alt="Weather icon"
              />
            </div>
          )}

          <button onClick={() => setSelectedCountry(null)}>Back</button>
        </div>
      ) : filteredCountries.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : (
        filteredCountries.map((country) => (
          <p key={country.cca3}>
            {country.name.common} <button onClick={() => setSelectedCountry(country)}>Show</button>
          </p>
        ))
      )}
    </div>
  );
};

export default App;
