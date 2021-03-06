import React, { useState, useEffect } from 'react'

import Search from './components/Search'
import DailyMain from './components/DailyMain'
import SinglesContainer from './components/SinglesContainer'
import DailiesContainer from './components/DailiesContainer'

import './App.css'

function App() {
  const [weather, setWeather] = useState()
  const [searchedCities, setSearchedCites] = useState([])
  const [showSearch, setShowSearch] = useState(false)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback)
  }, [])

  const getDataFromAPI = (woeid) => {
    fetch(
      `https://secret-ocean-49799.herokuapp.com/https://www.metaweather.com/api/location/${woeid}/`
    )
      .then((res) => res.json())
      .then((data) => setWeather(data))
  }

  const getWeather = (lat, lon) => {
    fetch(
      `https://secret-ocean-49799.herokuapp.com/https://www.metaweather.com/api/location/search/?lattlong=${lat},${lon}`
    )
      .then((res) => res.json())
      .then((data) => data[0].woeid)
      .then((woeid) => {
        getDataFromAPI(woeid)
      })
  }

  const getWeatherByCity = (city) => {
    fetch(
      `https://secret-ocean-49799.herokuapp.com/https://www.metaweather.com/api/location/search/?query=${city}`
    )
      .then((res) => res.json())
      .then((data) => data[0].woeid)
      .then((woeid) => {
        getDataFromAPI(woeid)

        // Avoids adding a non-existent city to the list of searches cities
        if (woeid) {
          // Avoids adding an already searched city to the list of searched cities
          if (!searchedCities.includes(city)) {
            setSearchedCites((prevState) => [...prevState, city])
          }
        }
      })
      .catch((error) => {
        // Needs better error handling, but now if the searched city doesn't exist, at least the app doesn't crash anymore
        console.log(error.message)
      })
  }

  const successCallback = (position) => {
    const lat = position.coords.latitude
    const lon = position.coords.longitude

    getWeather(lat, lon)
  }

  const errorCallback = (error) => {
    console.error(error)
  }

  const onSearchSubmit = (city) => {
    getWeatherByCity(city)
  }

  const onCityClick = (city) => {
    getWeatherByCity(city)
  }

  const onSearchClick = () => {
    setShowSearch(true)
  }

  const onCloseSearchClick = () => {
    setShowSearch(false)
  }

  return (
    <div className='App'>
      {weather ? (
        <div>
          {showSearch && (
            <Search
              onSearchSubmit={onSearchSubmit}
              cities={searchedCities}
              onCityClick={onCityClick}
              onCloseSearchClick={onCloseSearchClick}
            />
          )}
          {!showSearch && (
            <DailyMain weatherData={weather} onSearchClick={onSearchClick} />
          )}
          <DailiesContainer weatherArr={weather} />
          <SinglesContainer weatherData={weather} />

          <div className='signature'>
            <p className='signature__text'>
              created by{' '}
              <a className='signature__link' href='https://github.com/xaviguasch'>
                Xavi Guasch
              </a>{' '}
              - devChallenges.io
            </p>
          </div>
        </div>
      ) : (
        <h2 className='loading-text'>loading local weather data...</h2>
      )}
    </div>
  )
}

export default App
