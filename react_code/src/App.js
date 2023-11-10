import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';

const MapComponent = () => {
  const [citiesData, setCitiesData] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [paths, setPaths] = useState([]);

  useEffect(() => {
    fetch('https://gist.githubusercontent.com/dastagirkhan/00a6f6e32425e0944241/raw/33ca4e2b19695b2b93f490848314268ed5519894/gistfile1.json')
      .then(response => response.json())
      .then(data => {
        setCitiesData(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleCitySelection = (city) => {
    setSelectedCities(prevSelectedCities => {
      if (prevSelectedCities.includes(city.name)) {
        return prevSelectedCities.filter(selectedCity => selectedCity !== city.name);
      } else {
        return [...prevSelectedCities, city.name];
      }
    });
  };

  const findPaths = () => {
    const selectedCityCoordinates = selectedCities.map(cityName => {
      const city = citiesData.find(city => city.name === cityName);
      return {
        lat: parseFloat(city.lat),
        lon: parseFloat(city.lon),
      };
    });
    const paths = [selectedCityCoordinates];
    setPaths(paths);
  };

  const findShortestPath = () => {
    const selectedCityCoordinates = selectedCities.map(cityName => {
      const city = citiesData.find(city => city.name === cityName);
      return {
        lat: parseFloat(city.lat),
        lon: parseFloat(city.lon),
      };
    });
    const paths = [selectedCityCoordinates];
    fetch('http://localhost:3001/api/shortest-path', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paths }),
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error sending shortest path:', error));

    setPaths(paths);
  };

  return (
    <div>
      <div>
        <h2>Available Cities</h2>
        <ul>
          {citiesData.map((city, index) => (
            <li key={city.name} id={index}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedCities.includes(city.name)}
                  onChange={() => handleCitySelection(city)}
                />
                {city.name}
              </label>
            </li>
          ))}
        </ul>
        <button onClick={findPaths}>Find Paths</button>
        <button onClick={findShortestPath}>Find Shortest Path</button>
      </div>
      <MapContainer center={[20, 0]} zoom={2} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {selectedCities.map(cityName => {
          const city = citiesData.find(city => city.name === cityName);
          return (
            <Marker
              key={city.name}
              position={[parseFloat(city.lat), parseFloat(city.lon)]}
            >
              <Popup>{city.name}</Popup>
            </Marker>
          );
        })}
        {paths.map((path, index) => (
          <Polyline
            key={index}
            pathOptions={{ color: 'blue' }}
            positions={path.map(coord => [coord.lat, coord.lon])}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
