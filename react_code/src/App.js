
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';

const MapComponent = () => {
  const [cities, setCities] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [paths, setPaths] = useState([]);

  useEffect(() => {
    fetch('https://gist.githubusercontent.com/dastagirkhan/00a6f6e32425e0944241/raw/33ca4e2b19695b2b93f490848314268ed5519894/gistfile1.json')
      .then(response => response.json())
      .then(data => {
        setCities(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleCitySelection = (city) => {
    // Toggle city selection
    setSelectedCities(prevCities => {
      if (prevCities.includes(city)) {
        return prevCities.filter(selectedCity => selectedCity !== city);
      } else {
        return [...prevCities, city];
      }
    });
  };

  const findPaths = () => {
    const selectedCityCoordinates = selectedCities.map(city => ({
      lat: parseFloat(city.lat),
      lon: parseFloat(city.lon),
    }));
    const paths = [selectedCityCoordinates];
    setPaths(paths);
  };

  const findShortestPath = () => {
    const selectedCityCoordinates = selectedCities.map(city => ({
      lat: parseFloat(city.lat),
      lon: parseFloat(city.lon),
    }));
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

   // const shortestPath = paths[0];
    setPaths(paths); // Highlight the shortest path
  };

  return (
    <div>
      <div>
        <h2>Available Cities</h2>
        <ul>
          {cities.map((city, index) => (
            <li key={city.name} id = {index}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedCities.includes(city)}
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
        {selectedCities.map(city => (
          <Marker
            key={city.name}
            position={[parseFloat(city.lat), parseFloat(city.lon)]}
          >
            <Popup>{city.name}</Popup>
          </Marker>
        ))}
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
