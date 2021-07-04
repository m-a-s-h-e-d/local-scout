import React, { useRef, useEffect, useState } from "react";
import ReactMapGL, { Marker } from 'react-map-gl';
import Pins from './pins'
// var mapboxgl = require("mapbox-gl/dist/mapbox-gl.js"); 
// Switching to use react-map-gl wrapper for mapbox... made by uber for the market


/**
 *  Make a file called '.env.local' and put in your mapbox API key
 * Inside .env.local should be:
 * REACT_APP_MAPBOX_ACCESS_TOKEN=<your token goes here>
 */
// mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;


const cities = [
  {
    name: "Coquitlam",
    longitude: -122.793205,
    latitude: 	49.283764,
  },
  {
    name: "Burnaby",
    longitude: -122.994560,
    latitude: 49.246445,
  },
  {
    name: "Richmond",
    longitude: -123.133568,
    latitude: 	49.166592,
  },
]

export default function MapPage() {
  const mapContainer = useRef(null);
  // lng and lat set to vancouver
  const [lng, setLng] = useState(-123.116226);
  const [lat, setLat] = useState(49.246292);
  const [zoom, setZoom] = useState(10);
  const [locationData, setData] = useState([]);
  const [popData, setPopData] = useState(null);

  const [viewport, setViewport] = React.useState({
    longitude: lng,
    latitude: lat,
    zoom: zoom
  });

  // fetch data
  useEffect(() => {
    fetch('/get-data')
    .then((res) => res.json())
    .then((response) => {
      console.log(response.data)
      if (response.status === "success") {
        setData(Array(response.data))
        // console.log(locationData)
        console.log(typeof(locationData), "hello")
      } else {
        console.log("Unable to get data", response)
      }
    })
    .catch(
      (err) => console.error(err)
    );
    return () => {
      setData(null) // cleanup
    }
  }, [locationData])

  // const markers = React.useMemo(() => cities.map(
  //   city => (
  //     <Marker key={city.name} longitude={city.longitude} latitude={city.latitude}>
  //       <div>Check out {city.name}!! </div>
  //     </Marker>

  //   )
  // ), [cities])

  // useEffect(() => {
  //   const map = new mapboxgl.Map({
  //     container: mapContainer.current,
  //     style: "mapbox://styles/mapbox/streets-v11",
  //     center: [lng, lat],
  //     zoom: zoom
  //   });

  //   map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

  //   return () => {
  //     map.remove();
  //   };
  // }, [lng, lat, zoom]);

  return (
    <>
      {/* <div className="map-container" ref={mapContainer} /> */}
      <ReactMapGL {...viewport} width="100vw" height="100vh" onViewportChange={setViewport} mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}>
        <Pins data={locationData} onClick={setPopData}/>
      </ReactMapGL>
    </>
  );
}
